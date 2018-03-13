// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import vueLazyload from 'vue-lazyload'
// 加载swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import './assets/css/normalize.css'
import './assets/css/layout.css'
const imgError = require('./assets/imgs/img-error.png')
const imgLoading = require('./assets/imgs/load-s.gif')

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
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = baseConfig.baseApiUrl
Vue.prototype.$ajax = axios

// 图片懒加载设置
Vue.use(vueLazyload, {
  preLoad: 1.3,
  error: imgError,
  loading: imgLoading,
  attempt: 1
})

// 图片轮播
Vue.use(VueAwesomeSwiper)
Vue.prototype.pictureBaseUrl = baseConfig.baseUploads

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
