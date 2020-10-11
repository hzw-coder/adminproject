import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import './assets/css/gloable.css'
// 引入字体图标样式
import './assets/fonts/iconfont.css'
//配置axios
import axios from 'axios'
//导入编辑器
import VueQuillEditor from 'vue-quill-editor'

Vue.prototype.$http = axios
//配置默认的地址
const apiURL = 'http://127.0.0.1:8888/api/private/v1'
// 配置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = apiURL

Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
//定义一个全局的时间过滤器
Vue.filter('dateFormat', function (val) {
  let dt = new Date(val)
  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1 + '').padStart(2, '0')
  let d = (dt.getDate() + '').padStart(2, '0')

  let hh = (dt.getHours() + '').padStart(2, '0')
  let mm = (dt.getMinutes() + '').padStart(2, '0')
  let ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
