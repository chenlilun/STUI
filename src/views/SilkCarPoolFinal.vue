<template>
    <div id="app">
        <van-nav-bar
                title="拼车"
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
        <div class="doffType" @click.prevent v-if="doffType!=''">落筒类型:{{this.doffType==='AUTO'?'自动落筒':'手工落筒'}}</div>
        <div  style="background-color: #58727e;color: gold;height: 30px;line-height: 30px" v-if="this.chooseIndex!=-1">当前选择位置:{{ this.silks[this.chooseIndex].position}}</div>
        <ul class="sudoku_row">

            <li class="sudoku_item" :class="curSelect==silk.id?'opacity':''" v-for="(silk,index) in silks"
                :key="index">
                <!--                <img :src="sudoku.img_src" width="40" height="40" >-->

                <div :class="getColor(silk ,index)" @click="chooseSilk(silk,index)">

                    {{silk.position}}
                    <div style="font-size: 1px">
                        {{'..'+silk.silkCode.substr(silk.silkCode.length-8,silk.silkCode.length-1)}}
                    </div>
                    <div style="color: white; border: 1px solid red; border-radius: 6px;background-color: red"
                         v-if="silk.silkCode!=''"
                         @click="delSilk(index)"
                    >
                        删除
                    </div>

                </div>
            </li>
        </ul>


        <van-button type="danger" block hairline="hairline" v-if="this.showButton"
                    style="margin:  0;overflow: hidden ;display: inline" @click="dingDeng">拼车
        </van-button>

        <van-popup v-model="show"
                   close-icon-position="top-left"
                   closeable
                   position="right" :style="{ height: '100%' , width : '70%'  }   ">
            <div style="margin-top: 30px;margin-left: 8px">
                <van-steps direction="vertical" :active="0">
                    <van-step v-for="(item  , index) in events" :key="index">
                        <div>
                            <h3>操作类型:{{item.operate}}</h3>

                        </div>
                        <h3>操作人:{{item.post+' ' +item.operator}}</h3>
                        <h4>时间:{{ getTime(item.operateTime) }}</h4>
                        <van-collapse v-model="activeNames">
                            <van-collapse-item title="操作丝锭" :name="index"><p v-for="(i, index ) in item.silkCodes"
                                                                             :key="index"> {{i}}</p></van-collapse-item>
                        </van-collapse>
                        <van-button style="margin-top: 5px" type="danger" v-if="item.recover" @click="recover(item)" >撤销</van-button>
                        <van-divider
                                :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
                        >
                            分割线
                        </van-divider>
                    </van-step>

                </van-steps>
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
    function up(x,y){
        return x.id -y.id;
    }
    // import HelloWorld from "@/components/HelloWorld.vue";
    import {Toast} from "vant";

    import {Swipe, SwipeItem, Row, Col} from "vant";
    import Vue from 'vue';
    import {Grid, GridItem} from 'vant';

    import moment from 'moment'
    export default {
        name: "ForceSilkCarPool",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                events: [],
                chooseIndex: -1,
                silks: [{
                    id: 0,
                    position: 'A11',
                    silkCode: ''
                }, {
                    id: 1,
                    position: 'A12',
                    silkCode: ''
                }, {
                    id: 2,
                    position: 'A13',
                    silkCode: ''
                }, {
                    id: 3,
                    position: 'A14',
                    silkCode: ''
                }, {
                    id: 4,
                    position: 'A15',
                    silkCode: ''
                }, {
                    id: 9,
                    position: 'A21',
                    silkCode: ''
                }, {
                    id: 8,
                    position: 'A22',
                    silkCode: ''
                }, {
                    id: 7,
                    position: 'A23',
                    silkCode: ''
                }, {
                    id: 6,
                    position: 'A24',
                    silkCode: ''
                }, {
                    id: 5,
                    position: 'A25',
                    silkCode: ''
                }, {
                    id: 10,
                    position: 'A31',
                    silkCode: ''
                }, {
                    id: 11,
                    position: 'A32',
                    silkCode: ''
                }, {
                    id: 12,
                    position: 'A33',
                    silkCode: ''
                }, {
                    id: 13,
                    position: 'A34',
                    silkCode: ''
                }, {
                    id: 14,
                    position: 'A35',
                    silkCode: ''
                }, {
                    id: 15,
                    position: 'B11',
                    silkCode: ''
                }, {
                    id: 16,
                    position: 'B12',
                    silkCode: ''
                }, {
                    id: 17,
                    position: 'B13',
                    silkCode: ''
                }, {
                    id: 18,
                    position: 'B14',
                    silkCode: ''
                }, {
                    id: 19,
                    position: 'B15',
                    silkCode: ''
                }, {
                    id: 24,
                    position: 'B21',
                    silkCode: ''
                }, {
                    id: 23,
                    position: 'B22',
                    silkCode: ''
                }, {
                    id: 22,
                    position: 'B23',
                    silkCode: ''
                }, {
                    id: 21,
                    position: 'B24',
                    silkCode: ''
                }, {
                    id: 20,
                    position: 'B25',
                    silkCode: ''
                }, {
                    id: 25,
                    position: 'B31',
                    silkCode: ''
                }, {
                    id: 26,
                    position: 'B32',
                    silkCode: ''
                }, {
                    id: 27,
                    position: 'B33',
                    silkCode: ''
                }, {
                    id: 28,
                    position: 'B34',
                    silkCode: ''
                }, {
                    id: 29,
                    position: 'B35',
                    silkCode: ''
                }],
                curSelect: null,
                weiPosition: -1,
                weiList: [
                    {
                        "doffNo": "车",
                        "lineMachine": "整",
                    }],
                userId: '',
                hairline: this.showButton,
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
                activeNames: ['0'],
                activeNameArray: [],
                doffType:'',
                orginSilkCarRowColList:[]
            };
        },
        methods: {


            getTime: function (date) {
                let a  =  new Date(date)
                let b  =     a.setHours(a.getHours() -8)
                return moment(b).format('YYYY-MM-DD HH:mm:ss')
            },
            showButton(){
                let  a = false
                console.log('aaa',a)
                for (let i = 0; i < this.silks.length; i++) {
                    if(this.silks[i].silkCode!=''){
                        a = true
                    }
                }
                return a
            },
            delSilk(index) {

                this.silks[index].silkCode = ''
                this.chooseIndex = -1
            },
            chooseSilk(silk, index) {
                if (silk.silkCode != '') {
                    Toast('请先删除再更换该位置丝锭')
                } else {
                    console.log("aaaddd", index)
                    this.chooseIndex = index
                    console.log("aaaddd2", this.chooseIndex)
                }
            },
            getColor(item, index) {
                if (this.chooseIndex === index) {
                    console.log("aa", this.chooseIndex)
                    return 'chooseSilkStyle'
                }
                if (item.silkCode) {
                    return 'haveSilk'
                } else if ('' === item.silkCode) {
                    return 'white'
                }

            },
            touchstart: function (e) {
                var that = this;
                var list = that.sudokus;
                for (var i = 0, len = list.length; i < len; ++i) {
                    if (list[i].id == e) {
                        that.curSelect = i;
                    }
                }
            }, touchend: function () {
                var that = this;
                that.curSelect = null;
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
                let arr = []
                //去掉重复提交的丝锭

            /*    this.silks.forEach(a=>{
                    if(a.silkCode){
                        arr.push(a)
                    }
                })*/
                for(let a of this.silks){

                    if(a.silkCode&&this.isAddOrModify(a)){
                        arr.push(a)
                    }
                }
                if(arr.length>0){
                    this.$api.newSilkCarPooling({
                        operator: this.name,
                        id: this.data.id,
                        silkCarCode: this.silkCarCode,
                        operatorId: this.userId,
                        forceSilkCarPooingVoList:arr,
                        // grade: this.gradeData.find(a => a.firstRate).grade
                    }).then((res) => {
                        Toast(res.data.status)
                        if (res.data.status === '200') {
                            this.data = ''
                            this.chooseIndex = -1
                            this.silkCarCode = ''
                            this.orginSilkCarRowColList = []
                            for (let i = 0; i < this.silks.length; i++) {
                                this.silks[i].silkCode = ''
                            }

                            Toast.success(res.data.msg)
                        } else {
                            Toast(res.data.msg)
                        }
                    });
                }else {
                    Toast("请扫描要拼车的丝锭")
                }

            },
            isAddOrModify(a){
                let is = true
                this.orginSilkCarRowColList.forEach(b=>{
                    if((b.sideType+b.row+b.col+'')===a.position&&a.silkCode===b.silkCode){
                            is = false
                    }
                })
                return is

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
                    this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                } else {
                    this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                }

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
                // this.callByAndroid('0J4D109A00114D')
                this.show = true
            },
            callByAndroid(code) {
                // Toast("对了？" + code)
                if (code) {
                    if (this.$myUtils.checkIsSilkCar(code)) { // 丝车
                        this.silkCarCode = code;
                        this.getSilkcarDetails(code);
                    } else if (this.$myUtils.checkIsSilk(code)) { //丝锭
                        if (this.silkCarCode) {
                            // Toast(JSON.stringify(this.data.silkCarRowColList+'sssss' ))
                            if (this.chooseIndex === -1) {
                                Toast("请先选择位置")
                                return
                            }
                            let arr = []
                            this.silks.forEach(a => {
                                if (a.silkCode) {
                                    arr.push({silkCode: a.silkCode})
                                }
                            })
                            if (this.isContentThisSilk(code, arr)) {
                                // 解绑的丝锭数组


                                // this.silkCodeList.pushNoRepeat({"silkCode": code})
                                // this.silkCodeList.pushNoRepeat(code)
                                this.silks[this.chooseIndex].silkCode = code
                                // this.chooseIndex = -1
                                this.setChooseIndex(this.silks)

                            } else {
                                Toast("丝锭已经在车上了")
                            }
                        } else {
                            Toast('请先扫描丝车')
                        }




                    } else {
                        Toast('不符合规则')
                    }
                }

            },
            setChooseIndex(silks){
                // let arr = this.silks
                let a  =  silks.sort(up)
                for (let i = 0; i < a.length; i++) {
                    if(!a[i].silkCode){
                        this.chooseIndex = a[i].id
                            break
                    }
                }
            },
            isContentThisSilk(silk, list) {
                if (!(list instanceof Array)) return true
                let is = true
                list.forEach(a => {
                    if (a.silkCode === silk) {
                        is = false
                        Toast("不要重复扫码")
                    }
                })
                return is
            },
            getSilkcarDetails(code) {
              // this.getSilks()
                this.doffType = ''
                for (let i = 0; i < this.silks.length; i++) {
                    this.silks[i].silkCode = ''
                }
                this.chooseIndex = -1
                this.$api.getSilkss(code).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data;
                        this.doffType = res.data.data.doffType
                        this.events = res.data.data.events
                        if (this.events && this.events.length > 0) {

                            this.events.forEach(a => {
                                this.activeNameArray.push(this.activeName)
                            })
                        }
                        if(this.data.silkCarRowColList.length>0){
                            this.orginSilkCarRowColList = this.data.silkCarRowColList ;
                            let arr = this.data.silkCarRowColList ;
                            for (let i = 0; i < arr.length; i++) {
                                for (let j = 0; j < this.silks.length; j++) {
                                    if((arr[i].sideType+arr[i].row+arr[i].col)===this.silks[j].position){
                                        this.silks[j].silkCode = arr[i].silkCode
                                    }
                                }
                            }

                        }


                    } else {
                        this.silkCodeList = []
                        this.orginSilkCarRowColList = []
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
    .sudoku_row {
        display: flex;
        align-items: center;
        width: 100%;
        flex-wrap: wrap;
    }
    .doffType {

        align-items: center;

        font-size: 15px;
        box-sizing: border-box;
        color: brown;
        position: relative;
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

    .opacity {
        opacity: 0.4;
        background: #e5e5e5;
    }

    .sudoku_item img {
        margin-bottom: 3px;
        display: block;
    }

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

    .white {
        width: 100%;
        height: 70px;
        color: white;
        border-radius: 8px;
        padding: 1px;
        top: 50%;
        background-color: white;
        line-height: 50px; /*让黄色div中的文字内容垂直居中*/
        text-align: center;
        background-color: grey;
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
