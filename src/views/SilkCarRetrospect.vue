<template>
  <div id="app" class="main">
    <van-nav-bar
      title="丝锭追溯"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="index-page">
      <div>
        <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->
        <van-field
          v-model="silkCarCode"
          center
          clearable
          label="丝锭二维码"
          placeholder="请扫描丝锭二维码"
        >
          <template #button>
            <van-button size="small" type="primary" @click="findsc"
              >查询</van-button
            >
          </template>
        </van-field>
      </div>
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
      <div class="ban-ci">
        <span>选择班次</span>
        <van-checkbox-group v-model="banciResult" class="boxs">
          <van-checkbox name="a" style="margin-right: 5px">白班</van-checkbox>
          <van-checkbox name="b">夜班</van-checkbox>
        </van-checkbox-group>
      </div>
      <van-button size="small" type="primary" class="bt" @click="findSilkInfo"
        >查询</van-button
      >
      <div class="car-list">
        <div
          class="car-item"
          v-for="(item, index) in selectCarList"
          :key="index"
          @click="lookDetails(item)"
        >
          <div>落次:{{ item.doffNo }}</div>
          <div>落筒类型:{{ item.dofferType }}</div>
          <div>规格:{{ item.spec }}</div>
          <div>落筒时间:{{ item.doffingTime }}</div>
        </div>
      </div>
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
      //班次 7.50 21.50  7.50
      silkCarCode: "",
      xianbie: false,
      xianbieItem: {},
      xianbieStr: "",
      jitai: false,
      jitaiItem: {},
      jitaiStr: "",
      timeDate: "",
      selectTimeDate: new Date(),
      selectTime: "",
      calendarShow: false,
      minDate: new Date(2020, 9, 1),
      maxDate: new Date(2100, 10, 1),
      selectLinesList: [],
      selectMachinesList: [],
      banciResult: [],
      selectCarList: [],
    };
  },
  methods: {
    lookDetails(item) {
      console.log("item------" + JSON.stringify(item));

      localStorage.details = JSON.stringify(item);
      this.$router.push("/SilkCarRetrospectDetails");
    },
    findSilkInfo() {
      if (this.xianbieItem.lineName && this.jitaiItem.machineName) {
        if (this.timeDate != "" && this.banciResult.length > 0) {
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
          });
          var doffingTime = "";
          var doffingTimeEnd = "";
          console.log("this.banciResult.length" + this.banciResult.length);
          if (this.banciResult.length == 1) {
            console.log("this.banciResult.length" + this.banciResult.length);
            console.log(this.selectTime.getTime());
            //白班 7.50 - 19.50
            if (this.banciResult[0] == "a") {
              doffingTime =
                this.selectTime.getTime() + (8 * 60 - 10) * 60 * 1000;
              doffingTimeEnd = doffingTime + 12 * 60 * 60 * 1000;
              //夜班 19.50 - 7.50
            } else if (this.banciResult[0] == "b") {
              doffingTime =
                this.selectTime.getTime() + (22 * 60 - 10) * 60 * 1000;
              doffingTimeEnd = doffingTime + 12 * 60 * 60 * 1000;
            }
          } else if (this.banciResult.length == 2) {
            console.log("this.banciResult.length" + this.banciResult.length);
            doffingTime = this.selectTime.getTime() + (8 * 60 - 10) * 60 * 1000;
            doffingTimeEnd = doffingTime + 24 * 60 * 60 * 1000;
          }
          var startTime = new Date(doffingTime);
          var TimeEnd = new Date(doffingTimeEnd);
          /*           var startTime1 = moment(new Date(startTime)).format(
            "YYYY-MM-DD HH:mm"
          );
          var TimeEnd1 = moment(new Date(TimeEnd)).format("YYYY-MM-DD HH:mm");
          console.log("开始时间" + startTime1 + "-----" + "结束" + TimeEnd1); */
          this.$api
            .findSilkInfo({
              lineName: this.xianbieItem.lineName, //线别
              machineName: this.jitaiItem.machineName, //机台
              doffingTime: startTime, //落筒开始时间
              doffingTimeEnd: TimeEnd, //落筒结束时间
              // doffNo: "1", //落次,可选
              // silkCode: silkCode, //丝锭,可选
            })
            .then(
              (res) => {
                Toast.clear();
                if (
                  res.data &&
                  res.data.data != null &&
                  Array.isArray(res.data.data)
                ) {
                  this.selectCarList = res.data.data.map((item) => {
                    if (
                      item.silkReportVoList != null &&
                      item.silkReportVoList.length > 0
                    ) {
                      item.doffingTime = moment(
                        new Date(item.silkReportVoList[0].doffingTime)
                      ).format("YYYY-MM-DD HH:mm:ss");
                      item.spec = item.silkReportVoList[0].spec;
                      item.dofferType =
                        item.silkReportVoList[0].doffType == "AUTO"
                          ? "自动"
                          : "人工";
                      console.log(
                        item.silkReportVoList[0].doffType + "-----" + "AUTO"
                      );
                    }

                    return item;
                  });
                }

                if (this.selectCarList.length == 0) {
                  Toast.success("没有查询到落次");
                }

                console.log(JSON.stringify(this.selectCarList) + "sss");
                // console.log(JSON.stringify(res));
              },
              (err) => {
                Toast.success(err.message);
              }
            );
        } else {
          Toast("请选择日期和班次");
        }
      } else {
        Toast("请选择线别和机台");
      }
    },
    findsc() {
      this.$api
        .findSilkInfo({
          lineName: "", //线别
          machineName: "", //机台
          doffingTime: "", //落筒开始时间
          doffingTimeEnd: "", //落筒结束时间
          // doffNo: "1", //落次,可选
          silkCode: this.silkCarCode, //丝锭,可选
        })
        .then((res) => {
          if (
            res.data &&
            res.data.data != null &&
            Array.isArray(res.data.data)
          ) {
            this.selectCarList = res.data.data.map((item) => {
              if (
                item.silkReportVoList != null &&
                item.silkReportVoList.length > 0
              ) {
                item.doffingTime = moment(
                  new Date(item.silkReportVoList[0].doffingTime)
                ).format("YYYY-MM-DD HH:mm:ss");
                item.spec = item.silkReportVoList[0].spec;
                item.dofferType =
                  item.silkReportVoList[0].doffType == "AUTO" ? "自动" : "人工";
                console.log(
                  item.silkReportVoList[0].doffType + "-----" + "AUTO"
                );
              }

              return item;
            });
          } else {
            Toast.success(res.msg);
          }

          if (this.selectCarList.length == 0) {
            Toast.success("没有查询到落次");
          }

          console.log(JSON.stringify(this.selectCarList) + "sss");
          // console.log(JSON.stringify(res));
        });
    },
    callByAndroid(code) {
      // Toast("对了？" + code)
      if (code) {
        if (this.$myUtils.checkIsSilk(code)) {
          this.silkCarCode = code;
        } else {
          Toast("请扫码丝锭");
        }
      }
    },
    onClickLeft() {
      // Toast("返回");
      window.android.finish();
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.selectTime = date;
      this.timeDate = moment(date).format("YYYY-MM-DD");
    },
    selectLines() {
      this.$api.selectLines(1).then((res) => {
        if (res.data.status === "200") {
          this.selectLinesList = res.data.data.map((item) => {
            item.name = item.lineName;
            return item;
          });
          //  console.log(JSON.stringify(this.selectLinesList));
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
          // console.log(JSON.stringify(res.data));
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
      this.xianbieItem = item;
      this.selectMachines(item.id);
    },
    onSelectJiTai(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.jitai = false;
      this.jitaiItem = item;
      this.jitaiStr = item.name;
      // this.selectMachines(item.id);
    },
  },
  created() {
    this.userId = this.$route.query.userId; /*5f90616b0e6ef90b1af42832*/
    this.name = this.$route.query.name;
    this.selectLines();
  },
  mounted() {
    window.callByAndroid = this.callByAndroid;
  },
};
</script>

<style lang = "scss">
@import "./css/retrospect.scss";
</style>
