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
      <van-cell-group>
        <van-field v-model="silkCarCode" label="丝车条码" placeholder="请扫描丝车条码" />
      </van-cell-group>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>
<script type="text/javascript">
function callByAndroid() {
  alert("111");
  console.log("callByAndroid");
}
</script>

<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import { Toast } from "vant";
import { List } from "vant";
export default {
  name: "app",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      date: "",
      show: false,
      silkCarCode: "",
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  methods: {
    onClickLeft() {
      Toast("返回");
      window.android.finish();
    },
    onClickRight() {
      Toast("按钮");
          this.$api.selectWorkshops().then((res) => {
      console.log(res.data.data);
      console.log("大傻逼");
    });
    },
    callByAndroid(code) {
      Toast(code);
      this.silkCarCode = code;
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  created() {
    // alert("code")
    this.onLoad();

  },
  mounted() {
    window.callByAndroid = this.callByAndroid;
  },
};
function SetScanValue(model, code) {
  console.log("大哥" + code);
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
