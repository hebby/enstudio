import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Index from '@/views/index'
import Users from '@/views/users'
import AddUser from '@/views/addUser'
import Pictures from '@/views/pictures'
import AddPictures from '@/views/addPictures'
import Categories from '@/views/categories'
import products from '@/views/products'
import addProduct from '@/views/addProduct'
import store from '../store'
import myCookie from '../lib/cookie'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/user',
      name: 'user',
      component: AddUser
    },
    {
      path: '/pictures',
      name: 'pictures',
      component: Pictures
    },
    {
      path: '/pictures/add',
      name: 'addpictures',
      component: AddPictures
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/products',
      name: 'products',
      component: products
    },
    {
      path: '/products/add',
      name: 'addProduct',
      component: addProduct
    },
    {
      path: '/product/:proid',
      name: 'addProduct',
      component: addProduct
    }
  ]
})

router.beforeEach((to, from, next) => {
  let hasFrame = true
  if (to.name === 'login') {
    hasFrame = false
  } else {
    if (!myCookie.get('uid')) {
      hasFrame = false
      router.push('/login')
    }
  }
  store.commit('setPageFrame', hasFrame)
  next()
})

export default router
