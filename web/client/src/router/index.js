import Vue from 'vue'
import Router from 'vue-router'
import Detail from '@/views/detail'
import Search from '@/views/search'
import Categorys from '@/views/categorys'
import Index from '@/views/index'
import About from '@/views/about'
import GoodsList from '@/views/goods-list'
import NotFoundComponent from '@/views/404'
import ServerError from '@/views/error'

Vue.use(Router)

// 切换路由滚动到顶部
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0
      position.y = 0
    }
    return position
  }
}

let router = new Router({
  mode: 'history',
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { scrollToTop: true, title: '首页' }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: { scrollToTop: true, title: '搜索' }
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail,
      meta: { scrollToTop: true }
    },
    {
      path: '/category/:name',
      name: 'Categorys',
      component: Categorys,
      meta: { scrollToTop: true }
    },
    {
      path: '/goods/:name',
      name: 'GoodsList',
      component: GoodsList,
      meta: { scrollToTop: true }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: { scrollToTop: true, title: '联系我们' }
    },
    {
      path: '/404',
      name: 'noPage',
      component: NotFoundComponent
    },
    {
      path: '/server-error',
      name: 'error',
      component: ServerError
    },
    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})

export default router
