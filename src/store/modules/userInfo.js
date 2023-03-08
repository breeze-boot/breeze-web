import Vue from 'vue'
import Vuex from 'vuex'
import { login, logout } from '@/api/login'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    accessToken: localStorage.getItem('access_token'),
    authorities: localStorage.getItem('authorities'),
    userInfo: JSON.parse(localStorage.getItem('user_info'))
  },
  mutations: {
    setUserInfo: (state, userInfo) => {
      localStorage.setItem('user_info', JSON.stringify(userInfo))
      state.userInfo = userInfo
    },
    setAccessToken: (state, accessToken) => {
      localStorage.setItem('access_token', accessToken)
      state.accessToken = accessToken
    },
    setAuthorities: (state, authorities) => {
      localStorage.setItem('authorities', authorities)
      state.authorities = authorities
    }
  },
  actions: {
    /**
     * 登录
     *
     * @param commit
     * @param userLogin
     * @returns {Promise<>}
     * @constructor
     */
    login ({ commit }, userLogin) {
      userLogin.username.trim()
      userLogin.password.trim()
      return new Promise((resolve, reject) => {
        login(userLogin).then(response => {
          localStorage.setItem('B_TENANT_ID', response.data.userInfo.tenantId)
          commit('setAccessToken', response.data.accessToken)
          commit('setAuthorities', response.data.userInfo.authorities)
          commit('setUserInfo', response.data.userInfo)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 退出
     *
     * @param commit
     * @param state
     * @returns {Promise<>}
     * @constructor
     */
    logOut ({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout({ username: state.userInfo.username }).then(() => {
          commit('setAccessToken', '')
          commit('setAuthorities', [])
          commit('setUserInfo', {})
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 清空用户信息
     *
     * @param state
     */
    clearUserInfo (state) {
      state.userInfo = undefined
    }
  },
  getters: {
    /**
     * 获取登录用户名
     *
     * @param state
     * @returns {*|string}
     */
    getUsername (state) {
      return state.userInfo ? state.userInfo.username : ''
    }
  }
}
