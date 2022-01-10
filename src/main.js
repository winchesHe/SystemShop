import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/base.css'
// 导入axios
import axios from "axios"
// 导入vue-tree
import ZkTable from 'vue-table-with-tree-grid'
// 配置请求的跟路径
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/"
// 设置请求拦截
axios.interceptors.request.use(config=>{
  // 添加请求头请求内部API
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table',ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
