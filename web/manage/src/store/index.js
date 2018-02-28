import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    breadCrumbNavs: [],
    productPictures: [],
    editProductInfo: null,
    hasPageFrame: true,
    loginName: ''
  },
  mutations: {
    setBreadCrumbNav (state, value) {
      state.breadCrumbNavs = value
    },
    setProductPictures (state, value) {
      state.productPictures = value
    },
    setEditProductInfo (state, value) {
      state.editProductInfo = value
    },
    setPageFrame (state, value) {
      state.hasPageFrame = value
    },
    setLoginName (state, value) {
      state.loginName = value
    }
  },
  getters: {
    fullMenu: state => {
      return 'welcome to ' + state.curMenuName
    }
  }
})
