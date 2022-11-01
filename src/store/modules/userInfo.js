import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index'
import store from '@/store/index'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    userInfo: undefined
  },
  mutations: {
    setUserInfo (state) {
      state.userInfo = JSON.parse(localStorage.getItem('user_info'))
    }
  },
  actions: {},
  getters: {
    getUsername (state) {
      store.commit('userInfo/setUserInfo')
      if (!state.userInfo) {
        router.replace('/').then(r => {
          console.error(r)
        })
      }
      return state.userInfo.username
    }
  }
}
