import Vue from 'vue'
import App from './App.vue'
// import '../theme/index.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'default-passive-events'
// import './assets/element-variables.scss'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Base64 } from 'js-base64'
import md5 from 'js-md5'
import moment from 'moment'

/* axios.interceptors.request.use((config) => {
  console.log(config)
  config.headers.common['userinfo'] = window.sessionStorage.getItem('userinfo')
  // 在最后必须return config
  return config
}) */

Vue.prototype.moment = moment
Vue.prototype.axios = axios
Vue.prototype.Base64 = Base64
Vue.prototype.md5 = md5
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
// Vue.use(Base64)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
