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
import store from '../store'

Vue.use(Router)

const routerUtils = {}

// 切换路由滚动到顶部
routerUtils.scrollBehavior = (to, from, savedPosition) => {
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

// 获取待操作的初始化菜单
routerUtils.getMenus = (pathTo) => {
  let pathGoodsParams = {'recommend': '推荐', 'hot': '热门'}
  return {
    'about': pathTo.meta.title,
    'search': pathTo.query.q,
    'GoodsList': function () {
      let pname = pathTo.params.name
      if (pname in pathGoodsParams) {
        return pathGoodsParams[pname]
      }
    }
  }
}

// 更新store
routerUtils.updateStoreMenu = (menus) => {
  menus = menus || []
  // 设置当前导航面包屑
  store.commit('setBreadCrumbNav', menus)
  // 清空当前选中菜单
  store.commit('setCurrentMenu', {
    index: -2,
    name: '',
    url: '/'
  })
}

// 根据不同菜单设置菜单及面包屑状态
routerUtils.setDefaultMenuStatus = (pathTo) => {
  let util = routerUtils
  let menus = util.getMenus(pathTo)
  let pname = pathTo.name
  let navs
  if (pname in menus) {
    let pvalue = menus[pname] || ''
    let mName = pvalue instanceof Function ? pvalue() : pvalue
    navs = [
      {url: '/', name: '首页'},
      {url: '', name: mName}
    ]
  }
  util.updateStoreMenu(navs)
}

let router = new Router({
  mode: 'history',
  scrollBehavior: routerUtils.scrollBehavior,
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

// 全局路由设置，跳转前出发
router.beforeEach((to, from, next) => {
  routerUtils.setDefaultMenuStatus(to)
  next()
})

export default router
