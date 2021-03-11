<template>
  <div class="doffnew_container">
    <van-nav-bar title="人工落筒" left-text="返回" left-arrow @click-left="onClickLeft" />
    <article>
      <van-cell-group>
        <div :class="$style.field">
          <van-field v-model="doffForm.silkCarCode" label="丝车编号" placeholder="请扫码" />
          <van-button
            @click="scanSilkcar"
            :class="$style.fieldButton"
            type="primary"
            size="small"
          >扫丝车</van-button>
        </div>
        <div :class="$style.field">
          <van-field
            class="font-color-red"
            v-model="doffForm.machineName"
            label="机台信息"
            placeholder="请扫码"
          />
          <van-button
            @click="scanMachine"
            :class="$style.fieldButton"
            type="primary"
            size="small"
          >扫机台</van-button>
        </div>
        <van-field
          readonly
          clickable
          label="批号"
          :value="doffForm.batchNoDisplay"
          placeholder="请选择"
          @click="batchPicker = true"
          class="font-color-red"
        />
        <van-popup :close-on-click-overlay="false" v-model="batchPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="batchList"
            title="选择批号"
            @cancel="batchPicker = false"
            @confirm="confirmBatch"
          />
        </van-popup>
        <van-field
          readonly
          clickable
          label="落筒规则"
          :value="doffForm.doffRuleName"
          placeholder="请选择"
          @click="doffRulePicker = true"
        />
        <van-popup :close-on-click-overlay="false" v-model="doffRulePicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="doffRuleList"
            title="选择落筒规则"
            @cancel="doffRulePicker = false"
            @confirm="confirmDoffRule"
          />
        </van-popup>
      </van-cell-group>
      <h2 class="l-tips">落次位置组合列表</h2>
      <div class="doffnew_list">
        <div
          v-for="(item,i) in doffGroupList"
          :key="i"
          :class="['doffnew_item','batchNo-'+item.mq.batchNo,'status-'+item.status]"
        >
          <div class="doffnew_layout">
            <strong>{{item.positionName}}</strong>
            <div
              v-if="item.mq.lineName"
            >{{`${item.mq.lineName}-${item.mq.machinName}-${item.mq.doffNo}`}}</div>
            <div class="doffnew_status">{{item.status | statusFilter(item.mq.batchNo)}}</div>
          </div>
          <div class="doffnew_layout">
            <div class="doffnew_batchNo">{{item.mq.batchNo}}</div>
            <div v-if="item.mq.doffTime">{{item.mq.doffTime | timeFilter('MM-DD HH:mm')}}</div>
            <div v-if="item.netWeight" class="doffnew_weight">{{item.netWeight | weightFilter}}</div>
            <van-button @click="deleteDoff(item)" v-if="item.status" size="mini" type="danger">删除</van-button>
            <van-button
              @click="changePosition(item)"
              :disabled="hasDoffNotSubmit"
              v-else-if="item.mq.batchNo"
              size="mini"
              type="warning"
            >修改位置</van-button>
            <van-button
              @click="saveDoff(item)"
              :disabled="!doffForm.machineName"
              v-else
              size="mini"
              type="primary"
            >保存落次</van-button>
          </div>
        </div>
      </div>
      <div :class="$style.footer">
        <van-button @click="onSubmit" type="info" round block>落筒提交</van-button>
      </div>
      <van-popup :close-on-click-overlay="false" v-model="positionPicker" round position="bottom">
        <van-picker
          show-toolbar
          value-key="positionName"
          :columns="doffGroupList"
          title="选择落筒组合"
          @cancel="positionPicker = false"
          @confirm="savePosition"
        />
      </van-popup>
    </article>
  </div>
</template>

<script>
import { debounce } from 'lodash'
export default {
  components: {},
  data() {
    return {
      doffForm: {
        silkCarCode: '',
        machineName: '',
        doffRuleName: '',
        batchNo: '',
        batchNoDisplay: '',
      },
      mqDoffMessage: null,
      doffGroupList: [],
      batchPicker: false,
      batchList: [], // 批号选择列表
      doffRuleList: [],
      doffRulePicker: false,
      positionPicker: false,
      oldPosition: '',
      isDoffFlag: false,
      hasDoffNotSubmit: false,
      onSubmit: debounce(this.saveDoffGroup, 300),
    }
  },
  filters: {
    weightFilter(value) {
      return Number(value / 1000).toFixed(2) + 'kg'
    },
    statusFilter(value, batchNo) {
      let res = '未落筒'
      if (value) {
        res = '待提交'
      } else if (batchNo) {
        res = '已落筒'
      }
      return res
    },
  },
  watch: {
    doffGroupList: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.isDoffFlag = JSON.stringify(newVal).indexOf('batchNo') > -1
        this.hasDoffNotSubmit =
          JSON.stringify(newVal).indexOf('"status":1') > -1
      },
    },
  },
  created() {
    window.sessionStorage.index = 0
  },
  mounted() {
    window.callByAndroid = this.callByAndroid
  },
  methods: {
    /* 测试 start */
    scanSilkcar() {
      this.doffForm.silkCarCode = '9700P600003'
      this.resetLevel(1)
      this.getScanInfo()
    },
    scanMachine() {
      let index = +window.sessionStorage.index
      let arr = ['C5,1B', 'C5,2A', 'C5,1A']
      window.sessionStorage.index = index + 1
      this.doffForm.machineName = arr[index]
      // 初次扫机台
      !this.isDoffFlag && this.resetLevel(2)
      this.getScanInfo()
    },
    /* 测试 end */
    onClickLeft() {
      window.android.finish()
    },
    // 安卓扫码回调
    callByAndroid(code) {
      let codeType = this.$myUtils.checkCodeType(code)
      if (codeType === 'SILKCAR') {
        this.doffForm.silkCarCode = code
        this.resetLevel(1)
      } else if (codeType === 'MACHINE') {
        this.doffForm.machineName = code
        !this.isDoffFlag && this.resetLevel(2)
      }
      this.getScanInfo()
    },
    // 确认批号选择
    confirmBatch(row) {
      this.batchPicker = false
      this.selectBatchToDoffRule(row)
    },
    // 确认批号 => 落筒规则列表
    async selectBatchToDoffRule(row) {
      let { text, batchNo, silkCount } = row
      console.log(row, 'selectBatchToDoffRule row')
      this.doffForm.batchNo = batchNo
      this.doffForm.batchNoDisplay = text
      this.mqDoffMessage = row
      // 非首次落次
      if (this.isDoffFlag) return
      // 首次落次
      let res = await this.$api.getRulesByBatchNo({
        silkCarCode: this.doffForm.silkCarCode,
        silkCount,
      })
      this.doffRuleList = res.data.data.map((v) => ({
        text: v.doffRule.doffRuleName,
        ...v,
      }))
      this.doffForm.doffRuleName = ''
      this.doffRulePicker = true
    },
    // 确认落筒规则
    confirmDoffRule(row) {
      let { text } = row
      this.doffForm.doffRuleName = text
      this.doffRulePicker = false
      this.doffGroupList = this.dealSilkCarOnLinePositions(
        row.silkCarOnLinePositions
      )
    },
    // 重置级联数据
    resetLevel(level) {
      level < 2 && (this.doffForm.machineName = '')
      if (level < 3) {
        this.doffForm.batchNo = ''
        this.mqDoffMessage = null
        this.batchList = []
      }
      if (level < 4) {
        this.doffForm.doffRuleName = ''
        this.doffRuleList = []
        this.doffGroupList = []
      }
    },
    // 给落次位置组合中添加 mq:{}
    dealSilkCarOnLinePositions(arr) {
      let temp = arr.map((v) => {
        let mq = v.mq || {}
        return { ...v, mq }
      })
      return temp
    },
    // 处理批号列表展示
    dealBatchNoList(arr) {
      arr = arr || []
      if (!arr.length) return []
      this.batchPicker = true
      return arr.map((v) => ({
        ...v,
        // batchNo lineName-machinName-actualDoffNo-doffTime
        text: `${v.batchNo}  ${v.lineName}-${v.machinName}-${
          v.actualDoffNo
        } / ${this.formatTime(v.doffTime, 'MM-DD HH:mm')}`,
      }))
    },
    // 保存落次
    saveDoff(row) {
      row.status = 1
      row.mq = this.mqDoffMessage
      this.doffForm.machineName = ''
      this.doffForm.batchNoDisplay = ''
    },
    // 删除当前落次保存
    deleteDoff(row) {
      row.status = 0
      row.mq = {}
    },
    // 点击修改位置
    changePosition(row) {
      this.oldPosition = row.positionName
      let list = [...this.doffGroupList]
      list.forEach((v) => {
        if (v.positionName === row.positionName) {
          v.disabled = true
        } else {
          v.disabled = false
        }
      })
      this.doffGroupList = list
      this.positionPicker = true
    },
    // 保存位置修改
    async savePosition(row, index) {
      try {
        this.positionPicker = false
        let newIdx, oldIdx
        this.doffGroupList.forEach((v, i) => {
          if (v.positionName === this.oldPosition) {
            oldIdx = i
          } else if (v.positionName === row.positionName) {
            newIdx = i
          }
        })
        let list = [...this.doffGroupList]
        let oldIdxPositionName = list[oldIdx].positionName
        let newIdxPositionName = list[newIdx].positionName

        let res = await this.$dialog.confirm({
          title: '提示',
          message: `确认将${oldIdxPositionName}与${newIdxPositionName}进行交换？`,
        })

        // [old,new,x] =>  [new,old,x]
        list[oldIdx].oldPositionName = oldIdxPositionName
        list[oldIdx].positionName = newIdxPositionName
        list[newIdx].oldPositionName = newIdxPositionName
        list[newIdx].positionName = oldIdxPositionName
        ;[list[oldIdx], list[newIdx]] = [list[newIdx], list[oldIdx]]
        this.doffGroupList = list
        this.onSubmit()
      } catch (error) {}
    },
    // 扫丝车扫机台获取落筒规则+批号
    async getScanInfo() {
      let res = await this.$api.findDoffRule({
        ...this.doffForm,
        batchNo: this.doffForm.batchNo,
      })
      let {
        msg,
        status,
        data,
        data: {
          batch,
          doffRule,
          mqDoffMessages,
          lastBatch, // 上次批号信息
          currentBatch, // 手动生成批号
          silkCarOnLinePositions,
        },
      } = res.data
      if (status === '200') {
        if (batch) {
          // ! 已落筒 => 直接完善所有信息（除机台）
          this.doffForm.batchNo = batch.batchNo
          this.doffForm.doffRuleName = doffRule.doffRuleName
          this.doffGroupList = this.dealSilkCarOnLinePositions(
            silkCarOnLinePositions
          )
          console.log(data, mqDoffMessages, 'mqDoffMessages')
          this.batchList = this.dealBatchNoList(mqDoffMessages)
        } else {
          // ! 初次提交 mqDoffMessages 必有数据
          this.batchList = this.dealBatchNoList(mqDoffMessages)
        }
        this.$toast.success(msg)
      } else {
        if (!mqDoffMessages || !mqDoffMessages.length) {
          // 进行批号异常处理 => 展示异常处理弹框
          let list = []
          currentBatch && list.push(currentBatch.mqDoffMessage)
          lastBatch && list.push(lastBatch.mqDoffMessage)
          this.batchList = this.dealBatchNoList(list)
          this.batchPicker = true
        }
      }
    },
    // 保存提交
    async saveDoffGroup() {
      let { silkCarCode, doffRuleName, batchNo } = this.doffForm
      let params = {
        silkCarCode,
        doffRuleName,
        batchNo,
        // userId: window.sessionStorage.userId,
        userId: '5f33811b5fb3af54829f2d98',
      }
      params.silkCarOnLinePositions = this.doffGroupList
      let res = await this.$api.newManualDoff(params)
      let { msg } = res.data
      this.$toast.success(msg)
      this.getScanInfo()
    },
  },
}
</script>

<style lang="less" module>
.field {
  display: flex;
  align-items: center;
}
.fieldButton {
  width: 70px;
  margin-right: 10px !important;
}
.footer {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #eee;
}
</style>
<style lang="less" >
.font-color-red {
  input {
    color: red;
  }
}
.van-field__control {
  font-size: 16px;
}
// 修改vant组件样式，不能添加scoped
.doffnew {
  &_container {
    height: 100vh;
    box-sizing: border-box;
    padding-bottom: 65px;
    margin: 0;
    article {
      height: calc(100vh - 65px);
      overflow-y: auto;
    }
    .van-button--small {
      height: 8.533vw;
      padding: 0 2.133vw;
      font-size: 3.2vw;
    }
  }
  &_item {
    padding: 6px 16px;
    border-bottom: 1px solid #ebedf0;
  }
  &_layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
  }
}
</style>