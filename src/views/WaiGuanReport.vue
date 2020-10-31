<template>
    <div id="app">
        <van-nav-bar
                title="外观个人报表"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />

        <van-cell-group>
            <van-cell title="报表日期" :value="this.data.length>0? getTime(data[0].createTime):''"/>
        </van-cell-group>
        <div style="display: flex">
            <van-button type="primary" style="justify-content:space-between;flex-wrap: wrap;width: 49%"  @click="chooseTime(true)">开始时间:{{getTime2(startDate) }}</van-button>
            <van-button type="primary"  style="justify-content: left;width: 49%;margin-left: 5px"  @click="chooseTime(false)" >结束时间:{{getTime2(endDate)  }}</van-button>
        </div>

        <div class="divItem" v-for="(item,index) in data">
            <div class="onerow">
                <div class="col_item">
                    {{'台车:'+item.silkCarCode.substr(item.silkCarCode.length-3,item.silkCarCode.length)}}
                </div>
                <div class="col_item"> {{'纺位:'+getMachine(item.lineMachine)}}</div>
                <div class="col_item"> {{'线别:'+getLine(item.lineMachine)}}</div>
            </div>
            <div class="onerow">
                <div class="col_item"> {{'批号:'+item.batchNo}}</div>
                <div class="col_item"> {{'规格:'+item.spec}}</div>
                <div class="col_item"></div>
            </div>
            <div class="onerow">
                <div class="col_item_four"> {{'AA:'+getSilkCount('AA',item.spindleCount)}}</div>
                <div class="col_item_four"> {{'A：'+getSilkCount('A',item.spindleCount)}}</div>
                <div class="col_item_four"> {{'B:'+getSilkCount('B',item.spindleCount)}}</div>
                <div class="col_item_four"> {{'C:'+getSilkCount('C',item.spindleCount)}}</div>
            </div>
            <div class="onerow">
                <div style="margin-left: 25px;font-size: 12px;color: firebrick">
                    {{ getExcp(item.exceptionSpindle) }}
                </div>

            </div>
        </div>

        <!--底部弹出时间-->
        <van-popup
                v-model="showTime"
                :closeable="false"
                position="bottom"
                :style="{ height: '60%' }"
        >
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    title="选择完整时间"
                    @cancel="cancle()"
                    @confirm="confirmTime()"
                    :min-date="minDate"
                    :max-date="maxDate"
            />
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
    import Vue from 'vue';
    import {Grid, GridItem} from 'vant';
    import {DatetimePicker} from 'vant';


    import moment from 'moment'

    export default {
        name: "WaiGuanReport",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                isStart: true ,
                minDate: new Date(2020, 9, 1),
                maxDate: new Date(2100, 10, 1),
                currentDate: new Date(),
                events: [],
                showTime: false,
                chooseIndex: -1,
                silks: [],
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
                data: [],
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
                doffType: '',
                startDate:'',
                endDate:'',
            };
        },
        methods: {
        /*    cancel(){
                this.showTime = false
            },*/
            cancle(){
                this.showTime = false
            },
            getTime2: function (date) {
                let a = new Date(date)
                let b = a.setHours(a.getHours())
                return (date===null||date==={})?'': moment(b).format('YYYY-MM-DD HH:mm:ss')
            },
            addEight: function (date) {
                let a = new Date(date)
                let b = a.setHours(a.getHours()+8)
                return /*(date===null||date==={})?'': moment(b).format('YYYY-MM-DD HH:mm:ss')*/b
            },
            confirmTime(){
                console.log("aaaaaaaa"+this.currentDate)
                this.isStart?this.startDate=this.currentDate:this.endDate=this.currentDate
                console.log("sssssss"+this.startDate)
                console.log("eeeeeee"+this.endDate)
                this.showTime = false
                this.find()
            },
            chooseTime(start){
                console.log(this.startDate+"ddddddeeee")
                if(!start&&this.startDate===''){
                    Toast('请选择开始时间')
                    return
                }
                this.showTime = true
                this.isStart =start


            },
            getTime: function (date) {
                let a = new Date(date)
                let b = a.setHours(a.getHours())
                return moment(b).format('YYYY-MM-DD HH:mm:ss')
            },
            getExcp(list) {
                let str = ''
                let i = 1
                if (list != null && list.length > 0) {
                    list.forEach(a => {
                        str = str + a.machineName + '/' + a.spindleNum + '  ' + a.silkExceptions[0] + '; '
                        i++
                    })
                    return str
                } else {
                    return str
                }

            },
            getSilkCount(grade, list) {
                let str = '0'
                list.forEach(a => {
                    if (a.grade === grade) {
                        str = a.spindleCount + ''
                    }
                })
                return str
            },
            getLine(list) {
                return list[0].split('-')[0]
            },
            getMachine(list) {
                let str = ''
                list.forEach(a => {
                    str = str + a.split('-')[1] + '-'
                })
                return str.substr(0, str.length - 2)
            },

            getTime: function (date) {
                let a = new Date(date)
                let b = a.setHours(a.getHours() - 8)
                return moment(b).format('YYYY-MM-DD HH:mm')
            },
            showButton() {
                let a = false
                console.log('aaa', a)
                for (let i = 0; i < this.silks.length; i++) {
                    if (this.silks[i].silkCode != '') {
                        a = true
                    }
                }
                return a
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
            }
            , touchend: function () {
                var that = this;
                that.curSelect = null;
            },

            find() {
                this.data = []
                this.$api.findReportWaiguan({
                    operatorId: this.userId,
                    startDate: this.addEight(this.startDate),
                    endDate:  this.addEight(this.endDate)
                }).then((res) => {

                    if (res.data.status === '200') {

                        this.data = res.data.data

                        Toast.success(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                });
            },
            onClickLeft() {
                Toast("返回");
                window.android.finish();
            },
            onClickRight() {
                // this.callByAndroid('0J1V101A00214D')
                this.show = true
            },

        },
        created() {

            this.userId = this.$route.query.userId/*5f90616b0e6ef90b1af42832*/
            this.name = this.$route.query.name
            this.find()

        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
        },
    };
</script>

<style scoped>
    .onerow {
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

    .col_item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 33%;
        font-size: 5px;
        padding-bottom: 3px;
        box-sizing: border-box;
        color: white;
        position: relative;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .col_item_four {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 25%;
        padding-bottom: 3px;
        box-sizing: border-box;
        font-size: 0.42rem;
        color: white;
        position: relative;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

    .divItem {
        width: 100%;
        height: 100px;
        margin-top: 2px;
        color: white;
        border-radius: 8px;
        position: relative;
        padding: 1px;
        padding-top: 8px;
        font-size: 15px;
        /*让黄色div中的文字内容垂直居中*/
        background-color: lightseagreen;
    }

    .pcar {
        position: absolute;

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
