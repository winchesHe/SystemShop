import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/base.css'
// 导入axios
import axios from "axios"
// 配置请求的跟路径
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/"
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
