// @ts-nocheck
import '@/assets/styles/common.less'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@vant/touch-emulator' // 自动将mouse事件转换成对应的touch事件
import './plugins/vant.js'
import { NavBar } from 'vant'
import { List } from 'vant'
import api from './api/index.js'
import Cookie from 'js-cookie'
import myUtils from './util/myUtils'
// 防抖节流
// Vue.component('Debounce',Debounce)

import { Col, Row } from 'vant'
import { Tag } from 'vant'
import { Collapse, CollapseItem } from 'vant'
import { Popup } from 'vant'
import { Toast } from 'vant'
import { Divider } from 'vant'
import { Tab, Tabs } from 'vant'
// Vue.use(Debounce)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Divider)
Vue.use(Toast)
Toast.setDefaultOptions({ duration: 4000 })
Vue.use(Popup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tag)
Vue.use(Col)
Vue.use(Row)
Vue.use(NavBar)
Vue.use(List)
import { Step, Steps } from 'vant'

Vue.use(Step)
Vue.use(Steps)
Vue.prototype.$cookie = Cookie
Vue.prototype.$api = api
Vue.prototype.$myUtils = myUtils
Vue.config.productionTip = false
var vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
export default vue
