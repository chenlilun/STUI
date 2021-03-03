<template>
  <div id="app" class="main">
    <van-nav-bar title="丝锭详情" left-text="返回" right-text left-arrow @click-left="onClickLeft" />
    <div class="details">
      <div class="item">
        <div>{{ details.lineName }}-{{ details.machineName }}-{{ details.doffNo }}</div>
        <div>批次:{{ details.batchNo }}</div>
        <div>落筒类型:{{ details.dofferType }}</div>
        <div>规格:{{ details.spec }}</div>
        <div>落筒时间:{{ details.doffingTime }}</div>
      </div>
    </div>
    <div class="car-list">
      <div class="car-item" v-for="(item, index) in details.silkReportVoList" :key="index">
        <div>锭位数:{{ item.spindleNum }}</div>
        <div>丝锭号:{{ item.silkCode }}</div>
        <div>等级:{{ item.grade }}</div>
        <div v-if="item.packageBoxCode != null">位置:{{ item.packageBoxCode }}</div>
        <div v-else>
          位置:{{ item.silkCarCode }} - {{ item.sideType + "面" }}-{{
          item.row + "行"
          }}-{{ item.col + "列" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      details: {},
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
  },
  created() {
    this.userId = this.$route.query.userId /*5f90616b0e6ef90b1af42832*/
    this.name = this.$route.query.name

    this.details = JSON.parse(localStorage.details)
    if (
      this.details.silkReportVoList != null &&
      this.details.silkReportVoList.length > 0
    ) {
      this.details.lineName = this.details.silkReportVoList[0].lineName
      this.details.machineName = this.details.silkReportVoList[0].machineName
      this.details.batchNo = this.details.silkReportVoList[0].batchNo

      this.details.silkReportVoList = this.details.silkReportVoList.map(
        (item) => {
          item.netWeight = Number(
            String(item.netWeight / 1000).replace(/^(.*\..{4}).*$/, '$1')
          )
          return item
        }
      )
    }
  },
}
</script>

<style lang="less">
.main {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  flex-direction: column;
  align-content: center;
  box-sizing: border-box;

  .details {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    align-items: flex-start;

    .item {
      font-size: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .car-list {
    padding: 5px;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    .car-item {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-top: 10px;
      padding: 10px;
      width: 95%;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
