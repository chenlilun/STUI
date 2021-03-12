<template>
  <div id="app">
    <van-nav-bar
      title="拼车"
      left-text="返回"
      right-text="查看事件"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div style="margin: 10px;">
      <van-field v-model="silkCarCode" center clearable label="丝车条码" placeholder="请扫描丝车条码">
        <template #button>
          <van-button size="small" type="primary" @click="getSilkcarDetails">查询</van-button>
        </template>
      </van-field>
    </div>
    <div
      class="doffType"
      @click.prevent
      v-if="doffType!=''"
    >落筒类型:{{this.doffType==='AUTO'?'自动落筒':'手工落筒'}}</div>
    <div
      style="background-color: #58727e;color: gold;height: 30px;line-height: 30px"
      v-if="chooseIndex!==-1"
    >当前选择位置:{{ silks[chooseIndex].showPosition.join('-')}}</div>
    <ul class="silkingot_list has-delete">
      <li
        v-for="(silk,index) in silks"
        :class="['silkingot_item', chooseIndex===index?'choose':(silk.silkCode?'hasSilk':'')]"
        @click="chooseSilk(silk,index)"
        :key="index"
        :style="{width:1/col*100+'%'}"
      >
        <div>{{silk.showPosition.join('-')}}</div>
        <div v-if="silk.lineName">{{`${silk.lineName}-${silk.machineName}-${silk.doffNo}`}}</div>
        <div v-if="silk.spindleNum">{{silk.spindleNum}}</div>
        <div class="silkingot_item-delete" v-if="silk.silkCode" @click.stop="delSilk(silk,index)">删除</div>
      </li>
    </ul>

    <van-button
      type="danger"
      block
      v-if="isShowCarpooling"
      style="margin:  0;overflow: hidden ;display: inline"
      @click="dingDeng"
    >拼车</van-button>

    <van-popup
      v-model="show"
      close-icon-position="top-left"
      closeable
      position="right"
      :style="{ height: '100%' , width : '70%'  }   "
    >
      <div style="margin-top: 30px;margin-left: 8px">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item  , index) in events" :key="index">
            <div>
              <h3>操作类型:{{item.operate}}</h3>
            </div>
            <h3>操作人:{{item.post+' ' +item.operator}}</h3>
            <h4>时间:{{ getTime(item.operateTime) }}</h4>
            <van-collapse v-model="activeNames">
              <van-collapse-item title="操作丝锭" :name="index">
                <p v-for="(i, index ) in item.silkCodes" :key="index">{{i}}</p>
              </van-collapse-item>
            </van-collapse>
            <van-button
              style="margin-top: 5px"
              type="danger"
              v-if="item.recover"
              @click="recover(item)"
            >撤销</van-button>
            <van-divider
              :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
            >分割线</van-divider>
          </van-step>
        </van-steps>
      </div>
    </van-popup>
  </div>
</template>

<script>
Array.prototype.pushNoRepeat = function () {
  for (let i = 0; i < arguments.length; i++) {
    let ele = arguments[i]
    if (this.indexOf(ele) == -1) {
      this.push(ele)
    }
  }
}
import { Toast } from 'vant'
import { Dialog } from 'vant'
import { Swipe, SwipeItem, Row, Col } from 'vant'

import moment from 'moment'
export default {
  name: 'ForceSilkCarPool',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  data() {
    return {
      events: [],
      chooseIndex: -1,
      silks: [],
      curSelect: null,
      weiPosition: -1,
      weiList: [
        {
          doffNo: '车',
          lineMachine: '整',
        },
      ],
      userId: '',
      name: '',
      silkCodeList: [],
      data: '',
      gradeData: [],
      radio: '1',
      showDoff: false,
      lineWeiDoff: '',
      date: '',
      capacity: '',
      show: false,
      silkCarCode: '',
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      activeNames: ['0'],
      activeNameArray: [],
      doffType: '',
      orginSilkCarRowColList: [],
      isShowCarpooling: false,
      col: 1,
      chooseIndexList: [],
    }
  },
  watch: {
    silks: {
      deep: true,
      immediate: true,
      handler(newVal) {
        for (let i = 0; i < newVal.length; i++) {
          const el = newVal[i]
          if (el.silkCode) {
            this.isShowCarpooling = true
            break
          }
        }
      },
    },
  },
  methods: {
    getTime: function (date) {
      let a = new Date(date)
      let b = a.setHours(a.getHours() - 8)
      return moment(b).format('YYYY-MM-DD HH:mm:ss')
    },
    delSilk(item, index) {
      let { showPosition, position, row, col, layer } = item
      this.silks.splice(index, 1, { showPosition, position, row, col, layer })
      this.chooseIndex = -1
    },
    chooseSilk(silk, index) {
      if (silk.silkCode) {
        Toast('请先删除再更换该位置丝锭')
      } else {
        this.chooseIndex = index
      }
    },
    dingDeng() {
      //找出原先在车上但是后面没有在车上的丝锭
      let silkCodes = []

      let arr = []
      //去掉重复提交的丝锭
      for (let a of this.silks) {
        if (a.silkCode /*&&this.isAddOrModify(a)*/) {
          let { silkCode, position } = a
          arr.push({ silkCode, position })
        }
      }
      if (arr.length > 0) {
        this.orginSilkCarRowColList.forEach((a) => {
          let ite = arr.find((item) => {
            return item.silkCode == a.silkCode
          })
          if (typeof ite == undefined) {
            silkCodes.push(a.silkCode)
          }
        })
      }

      if (arr.length > 0) {
        this.$api
          .newSilkCarPooling({
            operator: /*'D7乙班包装工'*/ this.name,
            id: this.data.id,
            silkCarCode: this.silkCarCode,
            operatorId: this.userId /*'5f904e116c9f1a52e806ac1c'*/,
            forceSilkCarPooingVoList: arr,
            silkCode: silkCodes,
            // grade: this.gradeData.find(a => a.firstRate).grade
          })
          .then((res) => {
            Toast(res.data.status)
            if (res.data.status === '200') {
              this.data = ''
              this.chooseIndex = -1
              this.silkCarCode = ''
              this.orginSilkCarRowColList = []
              for (let i = 0; i < this.silks.length; i++) {
                this.silks[i].silkCode = ''
                this.silks[i].info = ''
              }

              Toast.success(res.data.msg)
            } else if (res.data.status === '300') {
              Dialog.confirm({
                title: '存在没有解绑的丝锭',
                message: res.data.msg + '立即解绑？',
              })
                .then(() => {
                  let arr = []
                  arr.push({ silkCode: res.data.data.unbindSilkCode })
                  this.$api
                    .silkUnbind({
                      post: this.name /*"D7乙班包装工"*/,
                      grade: res.data.data.grade,
                      silkCarCode: res.data.data.unbindSilkCarCode,
                      modifier: this.userId /*'5f904e116c9f1a52e806ac1c'*/,
                      silkCarRowColList: arr,
                      separateFlag: true,
                    })
                    .then((res) => {
                      if (res.data.status === '200') {
                        Toast.success(res.data.msg + '请重新提交拼车')
                      } else {
                        Toast.clear()
                        Toast(res.data.msg)
                      }
                    })
                })
                .catch(() => {
                  // on cancel
                })
            } else {
              Toast(res.data.msg)
            }
          })
      } else {
        Toast('请扫描要拼车的丝锭')
      }
    },
    isAddOrModify(a) {
      let is = true
      this.orginSilkCarRowColList.forEach((b) => {
        if (
          b.sideType + b.row + b.col + '' === a.position &&
          a.silkCode === b.silkCode
        ) {
          is = false
        }
      })
      return is
    },
    chooseWei(clickIndex) {
      this.weiPosition = clickIndex
      this.silkCodeList = []
      if (clickIndex === 0) {
        this.data.silkCarRowColList.forEach((b) => {
          this.silkCodeList.pushNoRepeat(b.silkCode)
        })
      } else {
        this.data.silkCarRowColList
          .filter((a) => a.orderBy == this.weiList[clickIndex].orderBy)
          .forEach((b) => {
            this.silkCodeList.pushNoRepeat(b.silkCode)
          })
      }
    },
    onClickLeft() {
      Toast('返回')
      window.android.finish()
    },
    onClickRight() {
      // this.callByAndroid('0J50401A00111D')
      this.show = true
    },
    callByAndroid(code) {
      if (code) {
        if (this.$myUtils.checkIsSilkCar(code)) {
          // 丝车
          this.silkCarCode = code
          this.getSilkcarDetails()
        } else if (this.$myUtils.checkIsSilk(code)) {
          //丝锭
          if (this.silkCarCode) {
            if (this.chooseIndex === -1) {
              Toast('请先选择位置')
              return
            }
            if (JSON.stringify(this.silks).indexOf(code) === -1) {
              // 解绑的丝锭数组
              this.silks[this.chooseIndex].silkCode = code
              this.chooseIndex = this.findNextChooseIndex()
            } else {
              Toast('丝锭已经在车上了')
            }
          } else {
            Toast('请先扫描丝车')
          }
        } else {
          Toast('不符合规则')
        }
      }
    },
    // 自动选择下一个空位
    findNextChooseIndex() {
      let curIdx = this.chooseIndexList.findIndex((v) => v === this.chooseIndex)
      for (let i = curIdx + 1; i < this.chooseIndexList.length; i++) {
        const v = this.chooseIndexList[i]
        if (!this.silks[v].silkCode) {
          return v
        }
      }
      return -1
    },
    // 生成S型索引数组
    generateSIndexArray(row = 3, col = 5, layer = 1) {
      let sum = row * col * layer * 2
      let temp = []
      for (let i = 0; i < 30; i++) {
        let line = parseInt(i / 5, 10)
        let isSingle = line % 2 === 0
        let remainder = i % 5
        if (isSingle) {
          temp.push(i)
        } else {
          temp.push(i + 4 - remainder * 2)
        }
      }
      return temp
    },
    getSilkcarDetails() {
      if (!this.silkCarCode) return
      this.doffType = ''
      this.silks = []
      this.chooseIndex = -1
      this.chooseIndexList = []
      this.$api.getSilkss(this.silkCarCode).then((res) => {
        let { status, msg, data } = res.data
        if (status === '200') {
          this.data = data
          this.doffType = data.doffType
          this.events = data.events
          if (this.events && this.events.length > 0) {
            this.events.forEach((a) => {
              this.activeNameArray.push(this.activeName)
            })
          }

          this.orginSilkCarRowColList = data.silkCarRowColList || []
          /* 处理丝车展示数据 start */
          let { list, row, col, layer } = this.$myUtils.dealSilkIngotList(data)
          this.silks = list
          this.col = col
          this.chooseIndexList = this.generateSIndexArray(row, col, layer)
          /* 处理丝车展示数据 end */
        } else {
          this.$toast.fail(msg)
          this.silkCodeList = []
          this.orginSilkCarRowColList = []
        }
      })
    },
    getDoff(arr) {
      let s = ''
      arr.forEach((e) => {
        let a = e.lineMachine + '/' + e.doffNo + '  '
        s = s + a
      })
      return s
    },
    getGrades() {
      this.$api.getGrades().then((res) => {
        if (res.data.code === 200) {
          this.gradeData = res.data.queryResult.list
        } else {
          Toast(res.data.message)
        }
      })
    },
  },
  created() {
    this.userId = this.$route.query.userId
    this.name = this.$route.query.name
    this.getGrades()
  },
  mounted() {
    window.callByAndroid = this.callByAndroid
  },
}
</script>

<style>
.doffType {
  align-items: center;
  font-size: 15px;
  box-sizing: border-box;
  color: brown;
  position: relative;
}
</style>
