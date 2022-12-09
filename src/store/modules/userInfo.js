import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    userInfo: JSON.parse(localStorage.getItem('user_info'))
  },
  mutations: {
    setUserInfo (state, userInfo) {
      localStorage.setItem('user_info', JSON.stringify(userInfo))
      state.userInfo = userInfo
    }
  },
  actions: {
    clearUserInfo (state) {
      state.userInfo = undefined
    }
  },
  getters: {
    getUsername (state) {
      return state.userInfo.username
    }
  }
}
