<template>
  <div id="app">
    <van-nav-bar
      title="丝车详情"
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

    <div class="topOne">
      <div @click.prevent>{{this.silkCarRowColList.length+'颗'}}</div>
      <div @click.prevent v-if="doffType!=''">{{this.doffType==='AUTO'?'自动落筒':'手工落筒'}}</div>
      <div @click.prevent>{{this.checkMember?whoIntrue():'外观未确认'}}</div>
      <div>{{currentBatch.tubeColor}}</div>
    </div>
    <li v-for="(item, index ) in list" :key="index" style="list-style: none">
      <div class="topOne">
        <div>数量:{{item.silkCarRowColList.length}}</div>
        <div>{{item.batch}}</div>
        <div>{{item.line+'/'+item.machine+'/'+item.doffNum}}</div>
        <div>{{item.grade}}</div>
      </div>
    </li>
    <ul class="sudoku_row">
      <li
        :class="['sudoku_item',silk.silkCode?'active':'']"
        v-for="(silk,index) in silks"
        :key="index"
        :style="{width:1/col*100+'%'}"
      >
        <div>{{silk.showPosition.join('-')}}</div>
        <div v-if="silk.lineName">{{`${silk.lineName}-${silk.machineName}-${silk.doffNo}`}}</div>
        <div>{{silk.spindleNum}}</div>
      </li>
    </ul>

    <van-button
      type="danger"
      block
      hairline="hairline"
      v-if="!showSecond"
      style="margin: 6px auto ;display: block ; "
      @click="debounceAppearanceConfirm"
    >外观确认</van-button>

    <footer class="ftor">
      <van-button
        type="danger"
        block
        hairline="hairline"
        v-if="showSecond&&juanRao"
        style="margin: 3px 3px;display: inline-block ; flex: 1"
        @click="dingDeng()"
      >定等</van-button>
      <van-button
        type="danger"
        block
        hairline="hairline"
        v-if="showSecond"
        style="margin: 3px 3px;display: inline-block ; flex: 1"
        @click="jumpJieBang()"
      >解绑</van-button>
    </footer>
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
            <van-button
              style="margin-top: 5px "
              type="danger"
              v-if="item.recover"
              @click="debounceRecover(item)"
            >撤销</van-button>
            <van-button
              style="margin-top: 5px;margin-left: 5px"
              type="danger"
              @click="debouncePrinter(item)"
            >补打标签</van-button>
            <van-collapse v-model="activeNames">
              <van-collapse-item title="操作丝锭" :name="index">
                <p v-for="(i, index ) in item.silkCodes" :key="index">{{i}}</p>
              </van-collapse-item>
            </van-collapse>

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
import { Toast } from 'vant'
import { Divider } from 'vant'
import moment from 'moment'
import { debounce } from 'lodash'
export default {
  name: 'app',
  data() {
    return {
      data: '',
      juanRao: true,
      doffType: '',
      silks: [],
      showSecond: false,
      checkMember: false,
      activeNames: ['0'],
      activeNameArray: [],
      showDoff: false,
      lineWeiDoff: '',
      date: '',
      capacity: '',
      show: false,
      events: [],
      silkCarCode: '9700F32006',
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      userId: '',
      name: '',
      silkCarRowColList: [],
      debounceAppearanceConfirm: debounce(this.AppearanceConfirm, 300),
      debounceRecover: debounce(this.recover, 300),
      debouncePrinter: debounce(this.print, 300),
      currentBatch: {},
      col: 1,
    }
  },
  methods: {
    whoIntrue() {
      if (this.data.checkTime) {
        return (
          this.getTimeSecond(this.data.checkTime) + this.data.checker + '确认'
        )
      } else {
        return '外观已确认'
      }
    },
    AppearanceConfirm() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      console.log('FFF')
      this.$api
        .qualityProducts({
          operatorId: this.userId,
          silkCarCode: this.silkCarCode,
        })
        .then((res) => {
          if (res.data.status === '200') {
            this.showSecond = true
            this.getSilkcarDetails()
            Toast.clear()
            Toast.success(res.data.msg)
          } else {
            Toast.clear()
            Toast(res.data.msg)
          }
        })
    },
    jumpJieBang() {
      let that = this
      this.$router.push({
        path: '/SubmitExcepAndUnbind',
        name: 'SubmitExcepAndUnbind', //要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找
        /*params: {
                        key: 'silkCodeJump',
                        msgKey: this.silkCarCode
                    }*/
        query: {
          silkCodeJump: this.silkCarCode,
          userId: this.userId,
          name: that.name,
        },
      })
    },
    dingDeng() {
      let that = this
      this.$router.push({
        path: '/SetGrade',
        name: 'SetGrade', //要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找
        /*params: {
                        key: 'silkCodeJump',
                        msgKey: this.silkCarCode
                    }*/
        query: {
          silkCodeJump: this.silkCarCode,
          userId: this.userId,
          name: that.name,
        },
      })
    },
    recover(item) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      console.log('aaa')
      let arr = []
      arr.push(item)

      this.$api
        .silkSeparateRecover({
          post: this.name,
          modifier: this.userId,
          silkCarCode: this.silkCarCode,
          events: arr,
        })
        .then((res) => {
          if (res.data.status === '200') {
            this.getSilkcarDetails()
            Toast.clear()
            Toast.success(res.data.msg)
          } else {
            Toast.clear()
            Toast(res.data.msg)
          }
        })
    },
    print(item) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      let arr = []
      arr.push(item)

      this.$api
        .printSilks({
          silkCarEvent: item,
          lineName: this.silkCarRowColList[0].lineName,
        })
        .then((res) => {
          Toast.clear()
          if (res.data.status === '200') {
            //发送Mq打印信息了
            Toast(
              '打印成功，请在' +
                this.silkCarRowColList[0].lineName +
                '打印机查看查看'
            )
          } else {
            Toast(res.data.msg)
          }
        })
    },
    getTime: function (date) {
      let a = new Date(date)
      let b = a.setHours(a.getHours() - 8)
      return moment(b).format('YYYY-MM-DD HH:mm:ss')
    },
    getTimeSecond: function (date) {
      let a = new Date(date)
      let b = a.setHours(a.getHours() - 8)
      return moment(b).format('MM-DD HH:mm')
    },
    onClickLeft() {
      Toast('返回')
      window.android.finish()
    },
    onClickRight() {
      // Toast("按钮3333");
      // this.$router.push({
      //   path: '/SilkUnbind',
      // })
      this.show = true
    },
    callByAndroid(code) {
      Toast(code)
      this.silkCarCode = code
      this.getSilkcarDetails(code)
    },
    dealSilkCarList(data) {
      let { row, col, layer, silkCarRowColList } = data
      if (!(row && col && layer)) return []
      this.col = col
      let list = []

      let sides = ['A', 'B']
      for (let m = 0; m < sides.length; m++) {
        for (let i = 1; i <= row; i++) {
          for (let k = 1; k <= layer; k++) {
            for (let j = 1; j <= col; j++) {
              let temp = []
              if (layer === 1) {
                temp.push(sides[m], i, j)
              } else {
                temp.push(sides[m], i, j, k)
              }
              list.push({
                showPosition: temp,
                sideType: sides[m],
                row: i,
                col: j,
                layer: k,
              })
            }
          }
        }
      }

      silkCarRowColList.forEach((v) => {
        let { sideType, row, col, layer } = v
        list.forEach((item) => {
          if (
            sideType === item.sideType &&
            row === item.row &&
            col === item.col &&
            layer === item.layer
          ) {
            item = Object.assign(item, v)
          }
        })
      })
      return list
    },
    getSilkcarDetails() {
      if (!this.silkCarCode) return
      this.silks = []
      this.doffType = ''
      this.events = []
      this.list = []
      this.currentBatch = {}
      this.silkCarRowColList = []
      this.$api.getSilkss(this.silkCarCode).then((res) => {
        console.log(res.data)
        if (res.data.status == '200') {
          this.currentBatch = res.data.data.batch
          this.checkMember = res.data.data.checkMember
          this.data = res.data.data
          if (res.data.data.checkMember) {
            this.showSecond = true
          } else {
            this.showSecond = false
          }
          if (this.name != '质检') {
            this.showSecond = true
          }
          this.list = []
          this.doffType = res.data.data.doffType
          this.events = res.data.data.events
          if (this.events && this.events.length > 0) {
            this.events.forEach((a) => {
              this.activeNameArray.push(this.activeName)
            })
          }

          res.data.data.spindleLists.forEach((e) => {
            this.list.push(e)
          })
          this.capacity = res.data.data.silkCarRowColList.length
          this.silkCarRowColList = res.data.data.silkCarRowColList
          this.silks = this.dealSilkCarList(res.data.data)
          if (
            res.data.data.silkCarOnLinePositions &&
            res.data.data.silkCarOnLinePositions.length > 0
          ) {
            this.lineWeiDoff = this.getDoff(
              res.data.data.silkCarOnLinePositions
            )
          }
          this.showDoff =
            res.data.data.doffType === 'MANUAL' ||
            res.data.data.doffType === 'AUTO'
          this.loading = false
          this.finished = true
        } else {
          Toast(res.data.msg)
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
    onRefresh() {
      // 清空列表数据
      // this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
    },
  },
  created() {
    this.userId = this.$route.query.userId

    this.name = this.$route.query.name // roleName 落丝
    if (this.name && this.name === '落丝') {
      this.juanRao = false
    }
    this.getSilkcarDetails()
  },
  mounted() {
    window.callByAndroid = this.callByAndroid
  },
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1px;
}

.van-field__label {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  box-sizing: border-box;
  /* width: 8.2em; */
  margin-right: 3.2vw;
  color: #646566;
  text-align: left;
  word-wrap: break-word;
}

/*顶部块样式*/
header {
  width: 100%;
  /*设置为伸缩盒子*/
  display: flex;
}

header > a {
  /*width: 100%;*/
  /*flex:设置当前子元素占据父容器剩余宽度的比例*/
  flex: 1;
}

header > a > img {
  width: 100%;
}

/*主体内容块样式*/
main {
  width: 100%;
  padding: 0 10px;
  /*设置盒模型*/
  box-sizing: border-box;
}

main > .item {
  width: 100%;
  height: 150px;
  background-color: #57c3ae;
  border-radius: 10px;
  margin-top: 10px;
  /*设置为伸缩盒子*/
  display: flex;
}

main > .item:nth-of-type(2) {
  background-color: #33aa46;
}

main > .item:nth-of-type(3) {
  background-color: #aa4b40;
}

main > .item:nth-of-type(4) {
  background-color: #445faa;
}

main > .item > .left {
  flex: 1;
}

main > .item > .right {
  flex: 2;
  /*设置换行显示*/
  flex-wrap: wrap;
  /*设置为伸缩盒子*/
  display: flex;
}

main > .item > .right > a {
  /*如果想让子元素换行显示，必须为子元素设置宽度*/
  width: 25%;
  box-sizing: border-box;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  display: block;
  color: #fff;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
}

main > .item > .right > a:nth-last-of-type(-n + 1) {
  border-bottom: none;
}

main > .extra {
  width: 100%;
  display: flex;
}

main > .extra > a {
  flex: 1;
}

main > .extra > a > img {
  width: 100%;
}

.ftor {
  background: #f2f3f6;
  max-width: 750px;
  width: 100%;
  height: 1rem;
  display: flex;
}

.topOne {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  border: 1px solid greenyellow;
  border-radius: 3px;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 25%;
    font-size: 15px;
    padding-bottom: 2px;
    box-sizing: border-box;
    color: brown;
    position: relative;
  }
}

.doffType {
  align-items: center;

  font-size: 15px;
  box-sizing: border-box;
  color: brown;
  position: relative;
}

.noSilk {
  width: 100%;
  height: 50px;
  color: white;
  border-radius: 8px;
  padding: 1px;
  top: 50%;
  background-color: white;
  line-height: 20px; /*让黄色div中的文字内容垂直居中*/
  text-align: center;
  background-color: grey;
}

.haveSilkOnDetail {
  width: 100%;
  height: 50px;
  padding: 1px;
  top: 50%;
  background-color: white;
  line-height: 20px; /*让黄色div中的文字内容垂直居中*/
  text-align: center;
}

.sudoku_row {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.sudoku_item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px;
  flex-direction: column;
  box-sizing: border-box;
  font-size: 0.42rem;
  position: relative;
  background-color: #aaa;
  border-radius: 8px;
  color: #333;
  line-height: 1.2;
  &.active {
    color: #fff;
    background-color: lightseagreen;
    margin-bottom: 1px;
  }
}
</style>
