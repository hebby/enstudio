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
var isDebug = false

var baseUploads = '/uploads'
var baseApiUrl = '/api'
if (isDebug) {
  baseApiUrl = `${location.protocol}//${location.hostname}:3000`
  baseUploads = `${location.protocol}//${location.hostname}:8082`
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = baseApiUrl
Vue.prototype.$ajax = axios

// 图片懒加载设置
Vue.use(vueLazyload, {
  preLoad: 1.3,
  error: imgError,
  loading: imgLoading,
  attempt: 1
})

// 图片轮播
Vue.use(VueAwesomeSwiper, /* { default global options } */)

// Vue.config.productionTip = false
Vue.prototype.pictureBaseUrl = baseUploads

router.beforeEach((to, from, next) => {
  let navs = [{url: '/', name: '首页'}]
  let urlName = to.name
  if (urlName === 'about') {
    navs.push({url: '', name: to.meta.title})
  } else if (urlName === 'search') {
    navs.push({url: '', name: to.query.q})
  } else if (urlName === 'index') {
    navs = []
  } else if (urlName === 'GoodsList') {
    if (to.params.name === 'recommend') {
      navs.push({url: '', name: '推荐'}) // 商品
    } else if (to.params.name === 'hot') {
      navs.push({url: '', name: '热门'}) // 商品
    }
  }
  if (navs.length !== 1) {
    store.commit('setBreadCrumbNav', navs)
    store.commit('setCurrentMenu', {
      index: -2,
      name: '',
      url: '/'
    })
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
