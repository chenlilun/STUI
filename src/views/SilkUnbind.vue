<template>
  <div id="app">
    <van-nav-bar
      title="丝车解绑"
      left-text="返回"
      right-text=""
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

    <a  v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)">
      <van-button  :type="item.type"  style="margin : 5px;width: 60px ; float: left">{{item.name}}</van-button>
    </a>




  </div>
</template>


<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import { Toast } from "vant";
// import { List } from "vant";
export default {
  name: "SilkUnbind",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      gradeData : [] ,
      radio : '1',
      showDoff: false,
      lineWeiDoff: "",
      date: "",
      capacity: "",
      show: false,
      silkCarCode: "9700P00007",
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
    };
  },
  methods: {
    chooseOne(clickIndex){
      this.gradeData.forEach((e , index)  => {
        if(index===clickIndex){
          this.gradeData[index].type = 'warning'
        }else {
          this.gradeData[index].type = 'primary'
        }

      })
    },
    find() {
      if (this.silkCarCode) {
        this.getSilkcarDetails(this.silkCarCode);
      }
    },
    onClickLeft() {
      Toast("返回");
      window.android.finish();
    },
    onClickRight() {
    },
    callByAndroid(code) {
      Toast(code);
      this.silkCarCode = code;
      this.getSilkcarDetails(code);
    },
    getSilkcarDetails(code) {
      this.$api.getSilkss(code).then((res) => {
        console.log(res.data.data.spindleLists);
      });
    },
    onLoad() {
      if (this.silkCarCode) {
        this.$api.getSilkss(this.silkCarCode).then((res) => {
          // console.log(res.data.data);
          // if (this.refreshing) {
          //   this.list = [];
          //   this.refreshing = false;
          // }
          // console.log(  JSON.stringify( res.data.data.spindleLists[0]));

          // this.list.push(res.data.data.spindleLists);
          res.data.data.spindleLists.forEach((e) => {
            this.list.push(e);
          });
          this.capacity = res.data.data.silkCarRowColList.length;
          if (res.data.data.silkCarOnLinePositions.length > 0) {
            this.lineWeiDoff = this.getDoff(
              res.data.data.silkCarOnLinePositions
            );
          }
          this.showDoff =
            res.data.data.doffType === "MANUAL" ||
            res.data.data.doffType === "AUTO";
          this.loading = false;
          this.finished = true;
        });
      }
    },
    getDoff(arr) {
      let s = "";
      arr.forEach((e) => {
        let a = e.lineMachine + "/" + e.doffNo + "  ";
        s = s + a;
      });
      return s;
    },
    onRefresh() {
      // 清空列表数据
      // this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  created() {
    // alert("code")
    this.gradeData = [
      {name:"AA",type:"primary"},
      {name:"B",type:"warning"},
      {name:"A",type:"primary"},
      {name:"C",type:"primary"},
      {name:"不定重",type:"primary"},
      {name:"不定重优等",type:"primary"},
      {name:"废丝",type:"primary"},
    ]
    this.onLoad();
  },
  mounted() {
    window.callByAndroid = this.callByAndroid;
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
  width: 8.2em;
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
  height: 100px;
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
  width: 50%;
  box-sizing: border-box;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  display: block;
  color: #fff;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
}
main > .item > .right > a:nth-last-of-type(-n + 2) {
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
/*底部块样式*/
footer {
  width: 100%;
  font-size: 13px;
}
footer > nav {
  width: 100%;
  display: flex;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
footer > nav > a {
  flex: 1;
  line-height: 30px;
  text-align: center;
  color: #888;
  text-decoration: none;
}
footer > .link {
  text-align: center;
  line-height: 25px;
}
footer > .copyRight {
  text-align: center;
}
</style>
