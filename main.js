import Vue from 'vue'
import App from './App'
import Helper from './common/helper.js'
import {request} from './api/request.js'
import API from './api/api.js'
import {textToast, showT, getProvider, WxPay, getLocation, refresh, CreateCustomerCart, stopAction ,getParamsFromUrl, setNavigatorBg} from './common/utils.js'
import store from './store/index.js'
// 引入全局uView
import uView from '@/components/uview-ui'
Vue.use(uView);

Vue.config.productionTip = false
Vue.prototype.helper= Helper
Vue.prototype.getLocation= getLocation
Vue.prototype.showT= showT
Vue.prototype.getProvider= getProvider
Vue.prototype.timeInterval= []
Vue.prototype.vue_g={}
Vue.prototype.themeColor_g= ''

Vue.prototype.$refresh= refresh
Vue.prototype.$WxPay= WxPay
Vue.prototype.$request= request
Vue.prototype.$API= API
Vue.prototype.$Toast = textToast
Vue.prototype.$stopAction = stopAction
Vue.prototype.$createCart = CreateCustomerCart
Vue.prototype.$getParamsFromUrl = getParamsFromUrl
Vue.prototype.$setNavigatorBg = setNavigatorBg

Vue.prototype.$store = store


App.mpType = 'app'

const app = new Vue({
  ...App,
	store
})
app.$mount()
