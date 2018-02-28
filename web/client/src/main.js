// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueLazyLoadImg from 'vue-lazy-load-img'
import './assets/css/normalize.css'
import './assets/css/layout.css'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = `${location.protocol}//${location.hostname}:3000`
Vue.prototype.$ajax = axios

Vue.use(VueLazyLoadImg)

// Vue.config.productionTip = false
Vue.prototype.pictureBaseUrl = `${location.protocol}//${location.hostname}:8081/static/uploads`

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
      navs.push({url: '', name: '推荐商品'})
    } else if (to.params.name === 'hot') {
      navs.push({url: '', name: '热门商品'})
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
