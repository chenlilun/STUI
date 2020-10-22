<template>
    <div id="app">
        <van-nav-bar
                title="废丝删除落次信息"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />

        <div style="margin: 10px;">
            <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->
            <van-field v-model="silkCarCode" center clearable label="机台条码" placeholder="请扫描机台二维码">
                <template #button>
                    <van-button size="small" type="primary" @click="find">查询</van-button>
                </template>
            </van-field>
        </div>

        <div class="main2" v-for="(item, index ) in data" :key="index">
            <div class="left">{{item.batchNo + '--锭数：'+item.silkCount+'--'+getTime(item.doffTime)}}</div>
            <div class="right" @click="deleteSilk(index)">
                删除
            </div>

        </div>
        <van-button type="danger" block hairline="hairline" v-if="hairline"
                    style="margin:  15px auto;overflow: hidden ;display: inline" @click="dingDeng">删除
        </van-button>


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
    import moment from 'moment'
    export default {
        name: "DeleteWasteSilk",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                weiPosition: -1,
                weiList: [
                    {
                        "doffNo": "车",
                        "lineMachine": "整",


                    },{
                        "doffNo": "面",
                        "lineMachine": "A",


                    },{
                        "doffNo": "面",
                        "lineMachine": "B",


                    }],
                userId: '',
                hairline: this.silkCodeList && this.silkCodeList.length > 0,
                name: '',
                silkCodeList: [],
                data: '',
                gradeData: [],
                radio: '1',
                showDoff: false,
                lineWeiDoff: "",
                date: "",
                capacity: "",
                show: false,
                silkCarCode: "",
                list: [],
                loading: false,
                finished: true,
                refreshing: false,
            };
        },
        methods: {
            getTime: function (date) {
                let a  =  new Date(date)
                let b  =     a.setHours(a.getHours() -8)
                return moment(b).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
            },
            dingDeng() {

                this.$api.deleteMqDoffMessageExcludeFullVolume(this.data).then((res) => {
                    if (res.data.status === '200') {
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''


                        Toast.success(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                });

            },
            deleteSilk(index) {
                this.data.splice(index, 1)
                // console.log(this.silkCodeList, "444232")
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
                    this.data.silkCarRowColList && this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                    })
                } if (clickIndex === 1) { // A
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.sideType === 'A').forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                    })
                }  if (clickIndex === 2) { //B
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.sideType === 'B').forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                    })
                }  else {
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                        console.log(b)

                    })
                }

                this.hairline = true
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
                // Toast("对了？" + code)
                if (code) {
                    if (this.$myUtils.checkMachine(code)) { // 机台
                        this.silkCarCode = code;
                        this.getSilkcarDetails(code);
                    } else {
                        Toast('不符合规则')
                    }
                }

            },
            isContentThisSilk(silk, list) {
                if (!(list instanceof Array)) return false
                let is = false
                list.forEach(a => {
                    if (a.silkCode === silk) {
                        is = true
                    }
                })
                return is
            },
            getSilkcarDetails(code) {
                this.$api.getWasteSilk({
                    lineName:code.split(',')[1],
                    machineName:code.split(',')[2],
                }).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data;

                        // this.data.silkCarOnLinePositions && this.data.silkCarOnLinePositions.forEach(a => {
                        //     this.weiList.push(a)
                        // })
                        // this.silkCodeList = []
                        // this.chooseWei(-1)

                    } else {
                        Toast(res.data.msg)
                        this.silkCodeList = []
                        this.data = [];
                    }
                    console.log(res.data);
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
            getGrades() {
                this.$api.getGrades().then((res) => {
                    if (res.data.code === 200) {
                        this.gradeData = res.data.queryResult.list;
                    } else {
                        Toast(res.data.message)
                        // console.log(res.data.queryResult , "aa")

                    }
                });
            }

        },
        created() {

            this.userId = this.$route.query.userId
            this.name = this.$route.query.name
            this.getGrades()

        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
        },
    };
</script>

<style>
    .main2 {
        margin: 5px 5px;
        height: 40px;
        display: flex;
        /*background-color: #33aa46;*/
        background-color: grey;
        overflow: hidden;
        border-radius: 6px;
    }

    .main2 > .left {
        flex: 3;
        line-height: 40px;
        padding-left: 8px;
        color: white;
    }

    .main2 > .right {
        flex: 1;
        line-height: 40px;
        color: red;
    }


</style>
