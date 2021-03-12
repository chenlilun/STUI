<template>
  <div id="app">
    <van-nav-bar
      title="打印丝锭条码"
      left-text="返回"
      right-text
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div style="margin: 10px;">
      <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->

      <van-field v-model="silkCarCode" center clearable label="丝车条码" placeholder="请扫描丝车条码">
        <template #button>
          <van-button size="small" type="primary" @click="find">查询</van-button>
        </template>
      </van-field>
    </div>
    <van-cell-group>
      <van-field v-model="line" label="产线" placeholder="请输入打印机所在产线" />
    </van-cell-group>
    <li v-for="(item, index ) in list" :key="index" style="list-style: none">
      <div class="topOne">
        <div class="topOneItem" @click.prevent>数量:{{item.silkCarRowColList.length}}</div>
        <div class="topOneItem" @click.prevent>{{item.batch}}</div>
        <div class="topOneItem" @click.prevent>{{item.line+'/'+item.machine+'/'+item.doffNum}}</div>
        <div class="topOneItem" @click.prevent>{{item.grade}}</div>
      </div>
    </li>
    <ul class="sudoku_row">
      <li class="sudoku_item" v-for="(silk,index) in silks" :key="index">
        <!--                <img :src="sudoku.img_src" width="40" height="40" >-->

        <div :class="getColor(silk ,index)">
          {{silk.position}}
          <div
            style="font-size: 1px"
          >{{'..'+silk.silkCode.substr(silk.silkCode.length-8,silk.silkCode.length-1)}}</div>
        </div>
      </li>
    </ul>
    <van-button
      type="danger"
      block
      hairline="hairline"
      v-if="showPrint"
      style="margin: 6px auto ;display: block ; "
      @click="AppearanceConfirm()"
    >打印</van-button>
    <footer class="ftor" v-if="false">
      <van-button
        type="danger"
        block
        hairline="hairline"
        v-if="showSecond"
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

    <!-- <van-field readonly name="picker" :value="capacity" label="丝锭数量:" placeholder />
    <van-field readonly :value="capacity" label="线别/位号/落次:" placeholder />-->

    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>


<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import { Toast } from 'vant'
import { Divider } from 'vant'
import moment from 'moment'
import { Dialog } from 'vant'
// import { List } from "vant";
export default {
  name: 'PrintSilkCodes',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      silks: [
        {
          id: 0,
          position: 'A11',
          silkCode: '',
        },
        {
          id: 1,
          position: 'A12',
          silkCode: '',
        },
        {
          id: 2,
          position: 'A13',
          silkCode: '',
        },
        {
          id: 3,
          position: 'A14',
          silkCode: '',
        },
        {
          id: 4,
          position: 'A15',
          silkCode: '',
        },
        {
          id: 5,
          position: 'A21',
          silkCode: '',
        },
        {
          id: 6,
          position: 'A22',
          silkCode: '',
        },
        {
          id: 7,
          position: 'A23',
          silkCode: '',
        },
        {
          id: 8,
          position: 'A24',
          silkCode: '',
        },
        {
          id: 9,
          position: 'A25',
          silkCode: '',
        },
        {
          id: 10,
          position: 'A31',
          silkCode: '',
        },
        {
          id: 11,
          position: 'A32',
          silkCode: '',
        },
        {
          id: 12,
          position: 'A33',
          silkCode: '',
        },
        {
          id: 13,
          position: 'A34',
          silkCode: '',
        },
        {
          id: 14,
          position: 'A35',
          silkCode: '',
        },
        {
          id: 15,
          position: 'B11',
          silkCode: '',
        },
        {
          id: 16,
          position: 'B12',
          silkCode: '',
        },
        {
          id: 17,
          position: 'B13',
          silkCode: '',
        },
        {
          id: 18,
          position: 'B14',
          silkCode: '',
        },
        {
          id: 19,
          position: 'B15',
          silkCode: '',
        },
        {
          id: 20,
          position: 'B21',
          silkCode: '',
        },
        {
          id: 21,
          position: 'B22',
          silkCode: '',
        },
        {
          id: 22,
          position: 'B23',
          silkCode: '',
        },
        {
          id: 23,
          position: 'B24',
          silkCode: '',
        },
        {
          id: 24,
          position: 'B25',
          silkCode: '',
        },
        {
          id: 25,
          position: 'B31',
          silkCode: '',
        },
        {
          id: 26,
          position: 'B32',
          silkCode: '',
        },
        {
          id: 27,
          position: 'B33',
          silkCode: '',
        },
        {
          id: 28,
          position: 'B34',
          silkCode: '',
        },
        {
          id: 29,
          position: 'B35',
          silkCode: '',
        },
      ],
      showSecond: false,
      showPrint: false,
      activeNames: ['0'],
      activeNameArray: [],
      showDoff: false,
      lineWeiDoff: '',
      date: '',
      capacity: '',
      line: '',
      show: false,
      events: [],
      silkCarCode: '',
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      userId: '',
      name: '',
      silkCarRowColList: [],
    }
  },
  methods: {
    getColor(item, index) {
      if (item.silkCode) {
        return 'haveSilkOnDetail'
      } else {
        return 'noSilk'
      }
    },
    AppearanceConfirm() {
      Dialog.confirm({
        title: '丝锭条码打印',
        message:
          '请仔细观察丝车资料与实物是否符合,不符合撤销落筒重新落，符合请打印？',
      })
        .then(() => {
          this.$api.print(this.line, this.silkCarCode).then((res) => {
            if (res.data.status === '200') {
              this.silkCarCode = ''
              Toast.clear()
              Toast.success(res.data.msg)
              this.list = []
              this.line = ''
              this.find()
            } else {
              Toast.clear()
              Toast(res.data.msg)
            }
          })
        })
        .catch(() => {
          // on cancel
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
      // Toast.loading({
      //     message: '撤销...',
      //     forbidClick: true,
      //     loadingType: 'spinner',
      //     duration:0
      // });
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
            this.find()
            Toast.clear()
            Toast.success(res.data.msg)
          } else {
            Toast.clear()
            Toast(res.data.msg)
          }
        })
    },
    find() {
      if (this.silkCarCode) {
        this.getSilkcarDetails(this.silkCarCode)
      } else {
        this.events = []
        this.list = []
        this.silkCarRowColList = []
        for (let i = 0; i < this.silks.length; i++) {
          this.silks[i].silkCode = ''
        }
      }
    },
    getTime: function (date) {
      let a = new Date(date)
      let b = a.setHours(a.getHours() - 8)
      return moment(b).format('YYYY-MM-DD HH:mm:ss')
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
    getSilkcarDetails: function (code) {
      this.$api.getSilkss(code).then((res) => {
        console.log(res.data)
        if (res.data.status == '200') {
          if (res.data.data.checkMember) {
            this.showSecond = true
          } else {
            this.showSecond = false
          }
          if (this.name != '质检') {
            this.showSecond = true
          }

          this.list = []

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
          if (this.silkCarRowColList && this.silkCarRowColList.length > 0) {
            this.line = this.silkCarRowColList[0].lineName
            this.showPrint = true
          } else {
            this.showPrint = false
            Toast('该丝车为空车')
          }
          if (
            this.silkCarRowColList.length > 0 /*&&this.data.forceCarPlooing*/
          ) {
            for (let i = 0; i < this.silkCarRowColList.length; i++) {
              for (let j = 0; j < this.silks.length; j++) {
                if (
                  this.silkCarRowColList[i].sideType +
                    this.silkCarRowColList[i].row +
                    this.silkCarRowColList[i].col ===
                  this.silks[j].position
                ) {
                  this.silks[j].silkCode = this.silkCarRowColList[i].silkCode
                }
              }
            }
          }

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
          Toast(res.data.msg + '不能打印')
          this.events = []
          this.list = []
          this.line = ''
          this.silkCarRowColList = []
          for (let i = 0; i < this.silks.length; i++) {
            this.silks[i].silkCode = ''
          }
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

    this.name = this.$route.query.name
    if (this.silkCarCode) {
      this.find()
    }
  },
  mounted() {
    window.callByAndroid = this.callByAndroid
  },
}
</script>

<style>
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
}

.topOneItem {
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
  color: white;
  border-radius: 8px;
  padding: 1px;
  top: 50%;
  background-color: white;
  line-height: 20px; /*让黄色div中的文字内容垂直居中*/
  text-align: center;
  background-color: lightseagreen;
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
  flex-direction: column;
  width: 20%;
  padding-bottom: 3px;
  box-sizing: border-box;
  font-size: 0.42rem;
  color: #111;
  position: relative;
}
</style>
