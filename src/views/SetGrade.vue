<template>
    <div id="app2">


        <div class="roll">
            <van-nav-bar
                    title="丝锭定等"
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
            <div style="overflow: hidden">设置等级</div>
            <div style="overflow: hidden;display: inline-block">
                <a v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)"
                   style="float: left">
                    <van-button :type="item.firstRate?'warning':'primary'"
                                style="margin : 5px;width: 60px ; float: left">
                        {{item.grade}}
                    </van-button>
                </a>
            </div>
            <div style="overflow: hidden">按位定等</div>
            <!--整车 按位-->
            <div style="display: inline-block">
                <div style="float: left">
                    <a v-for="(item, index ) in weiList" :key="index" @click.prevent="chooseWei(index)"
                       style="float: left ; overflow: hidden">
                        <van-button :color="weiPosition===index? '#ff976a':'#07c160'" style="margin : 5px;width: 80px ; float: left;overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;">{{item.lineMachine+'-'+item.doffNo}}
                        </van-button>
                    </a>

                </div>


            </div>
            <div class="main2" v-for="(item, index ) in silkCodeList" :key="index">
                <div class="left">{{item}}</div>
                <div class="right" @click="deleteSilk(index)">
                    删除
                </div>
            </div>
        </div>
        <footer class="ftor">
            <van-button type="danger" block hairline="hairline" v-if="silkCodeList.length>0"
                        style="margin: 0px 0px;display: inline-block" @click="dingDeng">确定
            </van-button>
        </footer>
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

    export default {
        name: "SilkUnbind",
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

            dingDeng() {
                let arr = [];
                this.silkCodeList.forEach(a => {
                    arr.push({silkCode: a})
                })
                this.$api.dingDeng({
                    post: this.name,
                    silkCarCode: this.silkCarCode,
                    modifier: this.userId,
                    silkCarRowColList: arr,
                    id: this.data.id,
                    grade: this.gradeData.find(a => a.firstRate).grade
                }).then((res) => {
                    if (res.data.status === '200') {
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''
                        this.weiList = [{
                            "doffNo": "车",
                            "lineMachine": "整",


                        }]
                        this.weiPosition = 0

                        Toast.success(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                });
            },
            deleteSilk(index) {
                this.silkCodeList.splice(index, 1)
                console.log(this.silkCodeList, "444232")
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
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                } else {
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
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
                if(window&&window.android){
                    window.android.finish();
                }else {
                    this.$router.go(-1);//返回上一层
                }


            },
            onClickRight() {
            },
            callByAndroid(code) {
                // Toast("对了？" + code)
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
                this.$api.getSilkss(code).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data;
                        // this.weiList = res.data.data.silkCarOnLinePositions
                        this.weiList = [{
                            "doffNo": "车",
                            "lineMachine": "整",


                        }]
                        this.data.silkCarOnLinePositions && this.data.silkCarOnLinePositions.forEach(a => {
                            this.weiList.push(a)
                        })
                        this.silkCodeList = []
                        this.chooseWei(0)

                    } else {
                        Toast(res.data.msg)
                        this.silkCodeList = []
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
            console.log("11111111",this.name)
            this.getGrades()

        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
            this.silkCarCode = this.$route.query.silkCodeJump
            this.userId = this.$route.query.userId
            this.name = this.$route.query.name
            if(this.silkCarCode&&this.silkCarCode!=""){
                this.getSilkcarDetails(this.silkCarCode);
            }
        },
    };
</script>

<style scoped="scoped">

    .ftor{
        background:#F2F3F6;max-width: 750px;width: 100%;height: 1rem;
    }
    app2{
        display:flex;display: -webkit-flex;height:100%;flex-direction:column;

    }
    .roll{
        flex: 1; width: 100%;overflow-y: scroll;-webkit-overflow-scrolling: touch;height: auto;
    }

    .main2 {
        margin: 5px 5px;
        height: 40px;
        display: flex;
        background-color: grey;
        overflow: hidden;
        border-radius: 6px;
    }

    .main2 > .left {
        flex: 3;
        padding-left: 8px;
        line-height: 40px;
        color: white;
    }

    .main2 > .right {
        flex: 1;
        line-height: 40px;
        color: red;
    }


</style>
