<template xmlns="http://www.w3.org/1999/html">
    <div id="app">
        <van-nav-bar
                title="合股丝落筒"
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
        <div style="overflow: hidden;text-align: left;margin-left: 10px">设置等级</div>
        <div style="overflow: hidden;margin-top: 8px">
            <a v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)" style="float: left">
                <van-button :type="item.firstRate?'warning':'primary'" style="margin : 5px;width: 60px ; float: left">
                    {{item.grade}}
                </van-button>
            </a>
        </div>

        <!--网格机台-->
        <ul class="sudoku_row">

            <li class="sudoku_item" :class="curSelect==machine.id?'opacity':''"
                v-for="(machine,index) in joinSilkMachine"
                :key="index">
                <!--                <img :src="sudoku.img_src" width="40" height="40" >-->

                <div :class="getColor(machine ,index)" @click="chooseSilk(machine,index)">

                    {{machine.position?machine.position:''}}
                    <br>
                    {{machine.line.lineName +'-'+machine.machineName}}
                    <br>
                    {{machine.haveScanNoDoff?'':''}}
                    <div style="font-size: 1px">
                        <!--                        {{'..'+machine.silkCode.substr(silk.silkCode.length-8,silk.silkCode.length-1)}}-->
                    </div>
                    <div style="color: white; border: 1px solid red; border-radius: 6px;background-color: red"
                         v-if="machine.haveScanNoDoff&&false"
                         @click=""
                    >
                        删除
                    </div>

                </div>
            </li>
        </ul>

        <van-button type="danger" block hairline="hairline" v-if="hairline"
                    style="margin:  15px auto;overflow: hidden ;display: inline" @click="dingDeng">落筒提交
        </van-button>
        <van-collapse v-model="activeName" accordion @change="change" v-if="false">
            <div v-for="(item, index ) in this.data.silkCarRowColList" :key="index">
                <van-collapse-item
                        :title="(item.batchNo===null||typeof(item.batchNo)===undefined||item.batchNo==='')?'未落筒':item.canModify?('已扫码'+item.showInfo):'已落筒'"
                        :value="(item.batchNo===null||typeof(item.batchNo)===undefined||item.batchNo==='')?'未落筒':item.canModify?'待提交':'已落筒'"
                        :border="true" value-class="van-cell__value">
                    <div class="van-collapse-item-div">{{item.silkCode===null?'请扫描机台':item.canModify===true
                        ?item.showInfo:(item.batchNo+" "+item.silkCode+'-'+item.doffNo)
                        }}
                    </div>
                </van-collapse-item>
            </div>

            <!--            <van-collapse-item title="标题2" name="2">内容</van-collapse-item>-->
            <!--            <van-collapse-item title="标题3" name="3">内容</van-collapse-item>-->
        </van-collapse>

        <!--        <van-cell is-link @click="showPopup">展示弹出层</van-cell>-->

        <van-popup
                v-model="show"
                closeable
                position="bottom"
                :style="{ height: '30%' }"
        >
            <div v-for="(item, index ) in this.doffNoPop" :key="index" @click="doffNoPopChoose(index)">

                <div class="van-collapse-item-div">
                    {{item.batchNo+" "+item.lineName+'-'+item.machinName+'-'+item.doffNo}}
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    Array.prototype.pushNoRepeat = function () {
        for (let i = 0; i < arguments.length; i++) {
            let ele = arguments[i];
            if (this.indexOf(ele) == -1) {
                this.push(ele);
            }
        }
    };
    // import HelloWorld from "@/components/HelloWorld.vue";
    import {Toast} from "vant";

    import {Swipe, SwipeItem, Row, Col} from "vant";

    Toast.setDefaultOptions({duration: 4000});
    export default {
        name: "JoinSilkDoff",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                machineIndex : -1 ,
                suggestOrderBy: -1,
                curSelect: null,
                chooseIndex: -1,
                machinId: '',
                doffNoPop: [],
                show: false,
                activeName: 0,
                activeNames: [1],
                weiPosition: -1,
                weiList: [
                    {
                        "doffNo": "车",
                        "lineMachine": "整",
                    }],
                userId: '',
                hairline: false,
                name: '',
                realName: '',
                silkCodeList: [],
                data: '',
                gradeData: [],
                radio: '1',
                showDoff: false,
                lineWeiDoff: "",
                date: "",
                capacity: "",

                silkCarCode: "",
                list: [],
                loading: false,
                finished: true,
                refreshing: false,
                currentScanMachineQrCode: '',
                joinSilkMachine: []
            };
        },
        methods: {
            delMachine(index) {
                // this.silks[index].silkCode = ''
                // this.chooseIndex = -1
                this.joinSilkMachine[index].haveScanNoDoff = null
                //删除位置
                for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                    console.log('11111111111'+this.data.silkCarRowColList[i].orderBy)
                    console.log(  '2222222222222222'+ this.joinSilkMachine[index].orderBy )
                    if( this.data.silkCarRowColList[i].orderBy ===   this.joinSilkMachine[index].orderBy  ){
                        this.data.silkCarRowColList[i].canModify = null
                        this.data.silkCarRowColList[i].batchNo = null
                    }
                }
                this.joinSilkMachine[index].haveScanNoDoff = null
                this.joinSilkMachine[index].orderBy = null
                this.joinSilkMachine[index].position = null
                //删除
            },
            chooseSilk(machine, index) {
                if (machine.haveDoff) {   // 已经落筒过了
                    Toast('已经落筒了请更换位置')
                } else if (machine.haveScanNoDoff) {   // 已扫码
                    Toast('已选择请退出重新选')
                } else {
                    console.log("aaaddd", index)
                    if(  this.activeName!=-1){
                        this.chooseIndex = index
                        // 查询该位置机台了
                        this.chooseMachine(machine.line.lineName + ',' + machine.machineName, index)
                    }else {
                        Toast('已选完')
                    }


                }
            },
            getColor(item, index) {
                if (this.chooseIndex === index) {  // 当前点击了该机台
                    console.log("aa", this.chooseIndex)
                    return 'chooseSilkStyle'
                }
                if (item.haveDoff) { // 已经落筒了
                    return 'haveSilk'
                } else if (item.haveScanNoDoff) { // 空位置，没写批号就是空位置
                    return 'haveScanNoDoff'
                } else {
                    return 'white'
                }

            },
            doffNoPopChoose(i) {  // 弹框选择
                if (this.currentScanMachineQrCode) {
                    //去重扫过的机台
                    for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                        let a = this.data.silkCarRowColList[i]
                        if (this.data.silkCarRowColList[i].silkCode && a.canModify && this.data.silkCarRowColList[i].silkCode === this.currentScanMachineQrCode.split(',')[0]) {
                            this.data.silkCarRowColList[i].silkCode = null
                            this.data.silkCarRowColList[i].doffNo = null
                            this.data.silkCarRowColList[i].batchNo = null
                            this.data.silkCarRowColList[i].canModify = null
                            this.data.silkCarRowColList[i].showInfo = null
                        }
                    }

                    // this.data.silkCarRowColList[this.activeName].silkCode =this.currentScanMachineQrCode.split(',')[0]
                    this.data.silkCarRowColList[this.activeName].silkCode = this.machinId
                    this.data.silkCarRowColList[this.activeName].doffNo = this.doffNoPop[i].doffNo
                    this.data.silkCarRowColList[this.activeName].batchNo = this.doffNoPop[i].batchNo
                    this.data.silkCarRowColList[this.activeName].doffTime = this.doffNoPop[i].doffTime
                    this.data.silkCarRowColList[this.activeName].canModify = true
                    this.data.silkCarRowColList[this.activeName].showInfo = this.doffNoPop[i].batchNo
                        + " " + this.doffNoPop[i].lineName + '-' + this.doffNoPop[i].machinName + '-' + this.doffNoPop[i].doffNo
                    this.hairline = true
                    if(this.activeName!=-1){
                        this.joinSilkMachine[this.machineIndex].haveScanNoDoff = true
                        this.joinSilkMachine[this.machineIndex].orderBy =  this.activeName+1
                        this.joinSilkMachine[this.machineIndex].position = this.getPosition(this.activeName+1)
                        this.chooseIndex = -1
                    }
                    this.activeName = this.getActiveName()
                }
                this.show = false;

                //选择下一个空位置落筒

            },
            showPopup() {
                this.show = true;
            },
            change(val) { // 手风琴改变时候回调
                console.log("aa" + val)
            },
            dingDeng() {
                // let arr  = []
                // // if( !this.silkCodeList|| this.silkCodeList.length==0||!this.silkCarCode){
                // //     Toast("请输入完整信息")
                // //     return
                // // }
                // this.silkCodeList.forEach(a=>{
                //     arr.push({silkCode:a})
                // })
                // Toast(arr + "xx")
                //不通批号不能提交
                let batNo = ''
                let isCan = true;
                if (this.data.silkCarRowColList) {
                    // a.batchNo==='null'||
                    this.data.silkCarRowColList.filter(a => a.batchNo != null).forEach((item, index) => {
                        if (index > 0) {
                            if (item.batchNo != batNo) {
                                isCan = false;
                            }
                        }
                        if (index === 0) {
                            batNo = item.batchNo
                        }
                        console.log(index, "index")
                        console.log(item, "item")


                    })
                }
                if (!isCan) {
                    Toast("一辆车不能落不同批号")
                    return;
                }

                this.data.silkCode = this.silkCarCode
                this.data.userId = this.userId
                this.data.grade = this.gradeData.find(a => a.firstRate).grade
                // this.data.silkCarRowColList.forEach((a , index)=>{
                //     if((typeof a.canModify === "undefined")||!a.canModify){
                //         this.data.silkCarRowColList.splice(index,1)
                //     }
                // })
                for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                    let a = this.data.silkCarRowColList[i]
                    if ((typeof a.canModify === "undefined") || !a.canModify) {
                        this.data.silkCarRowColList.splice(i, 1)
                        i--;
                    }
                }

                this.$api.manualDoff(this.data).then((res) => {

                    if (res.data.status === '200') {
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''
                        this.weiPosition = 0

                        Toast.success(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                });
            },
            chooseOne(clickIndex) {
                this.gradeData.forEach((e, index) => {
                    if (index === clickIndex) {
                        this.gradeData[index].firstRate = true
                    } else {
                        this.gradeData[index].firstRate = false
                    }

                })

            },
            chooseWei(clickIndex) {
                this.weiPosition = clickIndex
                this.silkCodeList = []
                if (clickIndex === 0) {
                    this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                } else {
                    this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                }

                // this.hairline = true
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
                // this.activeName = 2
                // this.show = true;
                this.callByAndroid("D8,56")
                Toast("aaaa")
            },
            isCanMoidfy(silkCarRowColList) {
                let b = true;
                silkCarRowColList.forEach(a => {
                    if (a.silkCode) {
                        b = false
                    }
                })
                return b
            },
            callByAndroid(code) {
                Toast(code)
                if (code) {
                    if (this.$myUtils.checkIsSilkCar(code)) { // 丝车
                        this.silkCarCode = code;
                        this.getSilkcarDetails(code);
                    } else if (this.$myUtils.checkIsSilk(code)) { //丝锭
                        if (this.data) {
                            // Toast(JSON.stringify(this.data.silkCarRowColList+'sssss' ))
                            if (this.isContentThisSilk(code, this.data.silkCarRowColList)) {
                                // 解绑的丝锭数组


                                // this.silkCodeList.pushNoRepeat({"silkCode": code})
                                this.silkCodeList.pushNoRepeat(code)

                                this.hairline = true
                            } else {
                                Toast("请扫描正确丝锭")
                            }
                        } else {
                            Toast('请先扫描丝车')
                        }
                    } else if (this.$myUtils.checkMachine(code)) {
                        console.log("机台")

                        if (!this.data.silkCarRowColList[this.activeName].canModify && this.data.silkCarRowColList[this.activeName].silkCode) {
                            Toast("已经落筒过了，请重新选择位置")
                            return
                        }
                        if (this.activeName == -1) {
                            Toast("请选择落筒位置")
                            return;
                        }
                        if (this.data === '' || this.data === null) {
                            Toast("请先扫描丝车")
                            return;
                        }
                        this.machinId = ''
                        this.$api.getMachineId(code.split(',')[0], code.split(',')[1]).then((a) => {
                            if (a.data.status === '200') {
                                this.machinId = a.data.data
                                this.$api.getMqDoffMessage(
                                    {
                                        silkCarCode: this.silkCarCode,
                                        doffType: "MANUAL",
                                        "machineId": a.data.data
                                    }
                                    /*{

                                    lineName: code.split(',')[1],
                                    machineName: code.split(',')[2]

                                }*/).then((res) => {
                                    if (res.data.status === '200') {

                                        this.doffNoPop = res.data.data.getMqDoffMessage
                                        let isCanModify = this.isCanMoidfy(this.data.silkCarRowColList)
                                        if (isCanModify) {
                                            this.data.silkCarRowColList = res.data.data.getSilkCarDoffSpec[0].silkCarRowColList
                                            this.data.doffSpecId = res.data.data.getSilkCarDoffSpec[0].doffSpecId
                                        }

                                        // console.log( this.data.doffSpecId +"ddddddddddddddddddd")
                                        // Toast(this.data.doffSpecId)
                                        if (this.doffNoPop.length > 1) {
                                            this.showPopup()
                                            this.currentScanMachineQrCode = code;
                                        } else {
                                            //控制删除重复扫过的机台
                                            for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                                                let a = this.data.silkCarRowColList[i]
                                                if (this.data.silkCarRowColList[i].silkCode && a.canModify && this.data.silkCarRowColList[i].silkCode === code.split(',')[0]) {
                                                    this.data.silkCarRowColList[i].silkCode = null
                                                    this.data.silkCarRowColList[i].doffNo = null
                                                    this.data.silkCarRowColList[i].batchNo = null
                                                    this.data.silkCarRowColList[i].canModify = null
                                                    this.data.silkCarRowColList[i].showInfo = null
                                                }
                                            }

                                            // this.data.silkCarRowColList[this.activeName].silkCode =code.split(',')[0]
                                            this.data.silkCarRowColList[this.activeName].silkCode = this.machinId
                                            this.data.silkCarRowColList[this.activeName].doffNo = this.doffNoPop[0].doffNo
                                            this.data.silkCarRowColList[this.activeName].batchNo = this.doffNoPop[0].batchNo
                                            this.data.silkCarRowColList[this.activeName].canModify = true
                                            this.data.silkCarRowColList[this.activeName].doffTime = this.doffNoPop[0].doffTime
                                            this.data.silkCarRowColList[this.activeName].showInfo = this.doffNoPop[0].batchNo
                                                + " " + this.doffNoPop[0].lineName + '-' + this.doffNoPop[0].machinName + '-' + this.doffNoPop[0].doffNo
                                            this.activeName = this.getActiveName()
                                            this.hairline = true
                                        }

                                    } else {
                                        Toast(res.data.msg)
                                    }
                                    console.log(res.data);
                                })
                            } else {
                                Toast(a.data.msg)
                            }

                        })

                    } else {
                        Toast('条码不符合规则')
                    }
                }

            },
            isContentThisSilk(silk, list) {
                if (!(list instanceof Array)) return false
                let is = true
                list.forEach(a => {
                    if (a.silkCode === silk) {
                        is = false
                        Toast("不能扫描当前丝车条码")
                    }
                })
                return is
            },
            getSilkcarDetails(code) {
                this.$api.getSilkCarDoff({
                    "silkCarCode": code,
                    "doffType": "MANUAL"
                }).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data[0];
                        this.getMachin(this.realName.substr(0, 2))
                        // 确定activeName 的值
                        this.activeName = this.getActiveName(true)
                    } else {
                        Toast(res.data.msg)
                    }
                    console.log(res.data);
                });
            },
            getActiveName() {

                for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                    if (this.data.silkCarRowColList[i].silkCode === null) {
                        return i
                    }
                }
                return -1


            },

            getDoff(arr) {

                let s = "";
                arr.forEach((e) => {
                    let a = e.lineMachine + "/" + e.doffNo + "  ";
                    s = s + a;
                });
                return s;
            },
            getGrades() {
                this.$api.getGrades().then((res) => {
                    if (res.data.code === 200) {
                        this.gradeData = res.data.queryResult.list;
                        this.gradeData.forEach((a, index) => {
                            if (this.gradeData[index].grade == 'A') {
                                this.gradeData[index].firstRate = true
                            } else {
                                this.gradeData[index].firstRate = false
                            }
                        })
                    } else {
                        Toast(res.data.message)
                        // console.log(res.data.queryResult , "aa")

                    }
                });
            },
            getMachin(line) {
                this.$api.findJoinSilkMachine(line).then((res) => {
                    if (res.data.status === '200') {
                        // this.data = res.data.data[0];
                        // this.activeName = this.getActiveName(true)
                        this.joinSilkMachine = res.data.data;
                        if (this.joinSilkMachine.length === 0) {
                            Toast(line + '没有合股丝，请联系班长配置')
                        } else {
                            //有合股丝就根据丝车落筒位置确认已经落筒的位置 跟已扫没有提交的位置 还有总数量不能超过 6  silkCarOnLinePositionList  里面有落过的机台信息
                            // 显示
                            this.showMachineDoff(this.data.silkCarOnLinePositionList)
                        }
                    } else {
                        Toast(res.data.msg)
                    }
                    console.log(res.data);
                });
            },
            showMachineDoff(list) {  // list 代表已经返回的落筒位置
                for (let i = 0; i < list.length; i++) {
                    for (let j = 0; j < this.joinSilkMachine.length; j++) {

                        if (list[i].lineMachine.split('-')[1] === this.joinSilkMachine[j].machineName) {
                            this.joinSilkMachine[j].haveDoff = true
                            this.joinSilkMachine[j].position = this.getPosition(list[i].orderBy)
                            this.joinSilkMachine[j].orderBy = list[i].orderBy
                        }
                    }
                }
            },
            getPosition(orderBy) {
                let s = ''
                switch (orderBy) {
                    case 1:
                        s = 'A面第3行'
                        break
                    case 2:
                        s = 'A面第2行'
                        break
                    case 3:
                        s = 'A面第1行'
                        break
                    case 4:
                        s = 'B面第3行'
                        break
                    case 5:
                        s = 'B面第2行'
                        break
                    case 6:
                        s = 'B面第1行'
                        break
                }
                return s
            },
            chooseMachine(code, index) { // 当前扫描的机台索引
                this.machinId = ''
                this.$api.getMachineId(code.split(',')[0], code.split(',')[1]).then((a) => {
                    if (a.data.status === '200') {
                        this.machinId = a.data.data
                        this.$api.getMqDoffMessage(
                            {
                                silkCarCode: this.silkCarCode,
                                doffType: "MANUAL",
                                "machineId": a.data.data
                            }
                            /*{

                            lineName: code.split(',')[1],
                            machineName: code.split(',')[2]

                        }*/).then((res) => {
                            if (res.data.status === '200') {
                                // 给一个推荐位置
                                // this.suggestOrderBy = this.suggestPosition()
                                // if (this.suggestOrderBy === -1) {
                                //     Toast('已经扫完，不能落筒')
                                //     return
                                // }

                                this.doffNoPop = res.data.data.getMqDoffMessage
                                let isCanModify = this.isCanMoidfy(this.data.silkCarRowColList)
                                if (isCanModify) {
                                    this.data.silkCarRowColList = res.data.data.getSilkCarDoffSpec[0].silkCarRowColList
                                    this.data.doffSpecId = res.data.data.getSilkCarDoffSpec[0].doffSpecId
                                }
                                if (this.doffNoPop.length > 1) {
                                    this.showPopup()
                                    this.machineIndex = index
                                    this.currentScanMachineQrCode = code;
                                } else {
                                    //控制删除重复扫过的机台
                                    for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                                        let a = this.data.silkCarRowColList[i]
                                        if (this.data.silkCarRowColList[i].silkCode && a.canModify && this.data.silkCarRowColList[i].silkCode === code.split(',')[0]) {
                                            this.data.silkCarRowColList[i].silkCode = null
                                            this.data.silkCarRowColList[i].doffNo = null
                                            this.data.silkCarRowColList[i].batchNo = null
                                            this.data.silkCarRowColList[i].canModify = null
                                            this.data.silkCarRowColList[i].showInfo = null
                                        }
                                    }

                                    // this.data.silkCarRowColList[this.activeName].silkCode =code.split(',')[0]
                                    this.data.silkCarRowColList[this.activeName].silkCode = this.machinId
                                    this.data.silkCarRowColList[this.activeName].doffNo = this.doffNoPop[0].doffNo
                                    this.data.silkCarRowColList[this.activeName].batchNo = this.doffNoPop[0].batchNo
                                    this.data.silkCarRowColList[this.activeName].canModify = true
                                    this.data.silkCarRowColList[this.activeName].doffTime = this.doffNoPop[0].doffTime
                                    this.data.silkCarRowColList[this.activeName].showInfo = this.doffNoPop[0].batchNo
                                        + " " + this.doffNoPop[0].lineName + '-' + this.doffNoPop[0].machinName + '-' + this.doffNoPop[0].doffNo
                                    if(this.activeName!=-1){
                                        this.joinSilkMachine[index].haveScanNoDoff = true
                                        this.joinSilkMachine[index].orderBy =  this.activeName+1
                                        this.joinSilkMachine[index].position = this.getPosition(this.activeName+1)
                                        this.chooseIndex = -1
                                    }
                                    this.activeName = this.getActiveName()
                                    this.hairline = true
                                }

                            } else {
                                Toast(res.data.msg)
                            }
                            console.log(res.data);
                        })
                    } else {
                        Toast(a.data.msg)
                    }

                })
            },
            suggestPosition() {
                let orderby = -1
                let list = this.data.silkCarPositionList
                for (let i = 0; i < list.length; i++) {
                    if (list[i].silkCode === null || list[i].silkCode) {
                        orderby = i + 1
                    }
                }
                return orderby
            }

        },
        created() {

            this.userId = this.$route.query.userId /*'5f904d826c9f1a52e806ac10'*/
            this.name = this.$route.query.name /*'D5乙班卷绕工'*/
            this.realName = this.$route.query.realName /*'D5乙班卷绕工'*/
            //查找某条线的合股丝


            this.getGrades()

        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
        },
    };
</script>

<style>
    .van-collapse-item-div {
        height: 50px;
        background-color: #57c3ae;
        width: 100%;
        border-radius: 6px;
        line-height: 50px;
        font-size: 20px;
        color: white;
    }

    .aa {
        color: #33aa46;
    }

    .main {
        margin: 1px;
        height: 40px;
        display: flex;
        background-color: #33aa46;
        border-radius: 3px;
        width: 100%;
    }

    .main > .left {
        flex: 4;
        line-height: 40px;
        color: white;
    }

    .main > .right {
        flex: 1;
        line-height: 40px;
        color: red;
    }

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
        height: 100px;
        background-color: #57c3ae;
        border-radius: 10px;
        margin-top: 10px;
        /*设置为伸缩盒子*/
        display: flex;
    }

    main > .item:nth-of-type(2) {
        background-color: #5b53aa;
    }

    main > .item:nth-of-type(3) {
        background-color: #aa4b40;
    }

    main > .item:nth-of-type(4) {
        background-color: #445faa;
    }

    main > .item > .left {
        flex: 1;
        display: flex;

    }

    main > .item > .right {
        flex: 2;
        /*设置换行显示*/
        flex-wrap: wrap;
        /*设置为伸缩盒子*/
        display: flex;
        overflow: hidden;
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

    .van-cell__value > span {
        position: relative;
        overflow: hidden;
        color: red;
        text-align: right;
        vertical-align: middle;
        word-wrap: break-word;
    }

    .van-cell__title > span {
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .van-toast__text {
        margin-top: 2.133vw;
        font-size: 25px;
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

    .haveSilk {
        width: 100%;
        height: 70px;
        color: white;
        border-radius: 8px;
        padding: 1px;
        top: 50%;
        background-color: white;
        line-height: 20px; /*让黄色div中的文字内容垂直居中*/
        text-align: center;
        background-color: lightseagreen;
    }

    .white {
        width: 100%;
        height: 70px;
        color: white;
        border-radius: 8px;
        padding: 1px;
        top: 50%;
        background-color: white;
        line-height: 20px; /*让黄色div中的文字内容垂直居中*/
        text-align: center;
        background-color: grey;
    }

    .haveScanNoDoff {
        width: 100%;
        height: 70px;
        color: white;
        border-radius: 8px;
        padding: 1px;
        top: 50%;
        background-color: white;
        line-height: 20px; /*让黄色div中的文字内容垂直居中*/
        text-align: center;
        background-color: #5b53aa;
    }

    .chooseSilkStyle {
        width: 100%;
        height: 70px;
        color: white;
        border-radius: 8px;
        padding: 1px;
        top: 50%;
        background-color: white;
        line-height: 20px; /*让黄色div中的文字内容垂直居中*/
        text-align: center;
        background-color: gold;
    }

</style>
