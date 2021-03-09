import Vue from 'vue'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.use(Lazyload, {})
Vue.prototype.$toast.setDefaultOptions({ duration: 4000 })
