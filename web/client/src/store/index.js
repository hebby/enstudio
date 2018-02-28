import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentMenu: {
      index: -2,
      alias: '',
      name: '',
      url: '/'
    },
    breadCrumbNav: []
  },
  mutations: {
    setCurrentMenu (state, value) {
      state.currentMenu = value
    },
    setBreadCrumbNav (state, value) {
      state.breadCrumbNav = value
    }
  },
  getters: {
    // fullMenu: state => {
    //   return 'welcome to ' + state.curMenuName
    // }
  }
})
