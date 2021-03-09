// @ts-nocheck
import '@/assets/styles/common.less'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@vant/touch-emulator' // 自动将mouse事件转换成对应的touch事件
import api from './api/index.js'
import Cookie from 'js-cookie'
import myUtils from './util/myUtils'
// 插件引入
import '@/plugins/vant.js'
import '@/plugins/index.js' // 自定义插件
// 防抖节流
// Vue.component('Debounce',Debounce)
// Vue.use(Debounce)

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
