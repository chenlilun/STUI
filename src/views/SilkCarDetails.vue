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
      <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->

      <van-field v-model="silkCarCode" center clearable label="丝车条码" placeholder="请扫描丝车条码">
        <template #button>
          <van-button size="small" type="primary" @click="find">查询</van-button>
        </template>
      </van-field>
    </div>
    <van-cell-group>
      <van-field label="丝锭数量:" v-model="capacity" readonly input-align="right" />
      <van-field
        v-if="showDoff"
        label="线别/位号/落次:"
        v-model="lineWeiDoff"
        readonly
        input-align="right"
        label-width="7.2em"
      />
    </van-cell-group>
    <ol style>
      <!-- <li v-for="(item, index ) in list" :key="index">{{ item.batch }}</li> -->
      <main v-for="(item, index ) in list" :key="index">
        <section class="item">
          <!-- <div class="left"></div> -->
          <div class="right" >
            <a @click.prevent>数量:{{item.silkCarRowColList.length}}</a>
            <a @click.prevent>{{item.batch}}</a>
            <a @click.prevent>{{item.line+'/'+item.machine+'/'+item.doffNum}}</a>
            <a @click.prevent>{{item.grade}}</a>

          </div>
        </section>
      </main>
    </ol>

    <!-- <van-field readonly name="picker" :value="capacity" label="丝锭数量:" placeholder />
    <van-field readonly :value="capacity" label="线别/位号/落次:" placeholder />-->

    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>


<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import { Toast } from "vant";
// import { List } from "vant";
export default {
  name: "app",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      showDoff: false,
      lineWeiDoff: "",
      date: "",
      capacity: "",
      show: false,
      silkCarCode: "9700P00006",
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
    };
  },
  methods: {
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
      Toast("按钮3333");
      this.$router.push({
        path: '/SilkUnbind',
      })
    },
    callByAndroid(code) {
      Toast(code);
      this.silkCarCode = code;
      this.getSilkcarDetails(code);
    },
    getSilkcarDetails(code) {
      this.$api.getSilkss(code).then((res) => {
        console.log(res.data);
        if(res.data.status=='200'){
          this.list = []
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
        }else {
          Toast(res.data.msg)
        }
      });
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

    },
  },
  created() {

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

</style>
