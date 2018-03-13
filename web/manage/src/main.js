// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from './router'
import Store from './store'
import Axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'

// 发布时修改
const isDebug = true
let baseConfig = {
  baseUploads: '/uploads',
  baseApiUrl: '/api'
}
if (isDebug) {
  const local = window.location
  baseConfig = {
    baseApiUrl: `${local.protocol}//${local.hostname}:3000`,
    baseUploads: `${local.protocol}//${local.hostname}:8082`
  }
}

// 更改axios默认设置
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Axios.defaults.baseURL = baseConfig.baseApiUrl
Vue.prototype.$ajax = Axios

// 自定义项
Vue.prototype.pictureBaseUrl = baseConfig.baseUploads

Vue.use(ElementUI)
Vue.use(VCharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Router,
  store: Store,
  template: '<App/>',
  components: { App }
})

