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
var isDebug = false

var baseUploads = '/uploads'
var baseApiUrl = '/api'
if (isDebug) {
  baseApiUrl = `${location.protocol}//${location.hostname}:3000`
  baseUploads = `${location.protocol}//${location.hostname}:8082`
}

Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Axios.defaults.baseURL = 'baseApiUrl'
Vue.prototype.$ajax = Axios

Vue.prototype.pictureBaseUrl = baseUploads
// Vue.config.productionTip = false

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

