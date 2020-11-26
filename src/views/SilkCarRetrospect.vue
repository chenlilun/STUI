<template>
  <div id="app" class="main">
    <van-nav-bar
      title="丝车追溯"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="index-page">
      <van-cell
        class="line"
        title="选择线别"
        style="font-size: 22px"
        :value="xianbieStr"
        @click="xianbie = true"
        is-link
      />
      <van-cell
        v-if="selectMachinesList.length > 0"
        class="line"
        title="选择机台"
        style="font-size: 22px"
        :value="jitaiStr"
        @click="jitai = true"
        is-link
      />
      <van-cell
        class="line"
        title="选择日期"
        style="font-size: 22px"
        :value="timeDate"
        @click="calendarShow = true"
        is-link
      />
      <van-button size="small" type="primary" class="bt" @click="find"
        >查询</van-button
      >
    </div>

    <van-popup v-model="calendarShow" class="two-pop" position="bottom">
      <van-datetime-picker
        v-model="selectTimeDate"
        type="date"
        title="选择日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="calendarShow = false"
      />
    </van-popup>
    <van-action-sheet
      v-model="xianbie"
      :actions="selectLinesList"
      @select="onSelectXianBie"
    />
    <van-action-sheet
      v-model="jitai"
      :actions="selectMachinesList"
      @select="onSelectJiTai"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import moment from "moment";
export default {
  components: {},
  data() {
    return {
      xianbie: false,
      xianbieStr: "",
      jitai: false,
      jitaiStr: "",
      timeDate: "",
      selectTimeDate: new Date(),
      calendarShow: false,
      minDate: new Date(2020, 9, 1),
      maxDate: new Date(2100, 10, 1),
      selectLinesList: [],
      selectMachinesList: [],
    };
  },
  methods: {
    onClickLeft() {
      Toast("返回");
      window.android.finish();
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.timeDate = moment(date).format("YYYY-MM-DD");
    },
    selectLines() {
      this.$api.selectLines(1).then((res) => {
        if (res.data.status === "200") {
          this.selectLinesList = res.data.data.map((item) => {
            item.name = item.lineName;
            return item;
          });
          console.log(JSON.stringify(this.selectLinesList));
        } else {
          Toast(res.data.msg);
        }
      });
    },
    selectMachines(id) {
      this.$api.selectMachines(id).then((res) => {
        if (res.data.status === "200") {
          this.selectMachinesList = res.data.data.map((item) => {
            item.name =
              item.line.workshop.workshop +
              "-" +
              item.line.lineName +
              "-" +
              item.machineName;
            return item;
          });
          console.log(JSON.stringify(res.data));
        } else {
          Toast(res.data.msg);
        }
      });
    },
    onSelectXianBie(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.xianbie = false;
      this.xianbieStr = item.name;
      this.selectMachines(item.id);
    },
    onSelectJiTai(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.jitai = false;
      this.jitaiStr = item.name;
      // this.selectMachines(item.id);
    },
  },
  created() {
    this.userId = this.$route.query.userId; /*5f90616b0e6ef90b1af42832*/
    this.name = this.$route.query.name;
    this.selectLines();
  },
};
</script>

<style lang = "scss">
@import "./css/retrospect.scss";
</style>
