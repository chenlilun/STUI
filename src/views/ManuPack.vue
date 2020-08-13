<template>
    <div id="app">
        <van-nav-bar
                title="人工打包"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />


        <a @.prevent.click style="color: #1989fa;line-height: 55px"> 打包颗数：</a>
        <van-button type="info" style="width: 120px" @click="show = true">{{this.silkNums}}</van-button>
        <p style="color: red;line-height: 40px">***请扫描丝车二维码***</p>
        <div style="text-align: left;">
            <div class="main" v-for="(item, index ) in silkCodeList" :key="index">
                <div class="left">{{item}}</div>
                <div class="right" @click="deleteSilk(index)">
                    删除
                </div>
            </div>

        </div>
        <van-button type="danger" block hairline="hairline" v-if="hairline"
                    style="margin:  15px auto;overflow: hidden ;display: inline" @click="dingDeng">确定
        </van-button>

        <van-number-keyboard
                v-model="silkNums"
                :show="show"
                :maxlength="3"
                @blur="show = false"
        />

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
        name: "ManuPack",

        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                silkNums: '80',
                weiPosition: -1,

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
                show: true,
                silkCarCode: "9700P00006",
                list: [],
                loading: false,
                finished: true,
                refreshing: false,
            };
        },
        methods: {

            dingDeng() {

                this.$api.handPack({
                    silkCarCodes: this.silkCodeList,
                    silkCount: this.silkNums,
                    operator: this.userId,
                }).then((res) => {
                    if (res.data.status === '200') {
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''

                        this.weiPosition = 0

                        Toast(res.data.msg)
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
                    this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                } else {

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
                    if (code.length === 10) { // 丝车
                        this.silkCodeList.pushNoRepeat(code)
                        this.hairline = true
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


                    } else {
                        Toast(res.data.msg)
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
    .main {
        margin: 15px;
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
        width: 8.2em;
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


</style>
