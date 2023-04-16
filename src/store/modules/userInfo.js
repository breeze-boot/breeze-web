import Vue from 'vue'
import Vuex from 'vuex'
import { login, logout, sms, userInfo } from '@/api/login/login'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    accessToken: localStorage.getItem('access_token'),
    authorities: localStorage.getItem('authorities'),
    userInfo: JSON.parse(localStorage.getItem('user_info')),
    tenantId: JSON.parse(localStorage.getItem('TENANT_ID'))
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
      const loginParam = {
        username: userLogin.username.trim(),
        password: userLogin.password.trim()
      }
      return new Promise((resolve, reject) => {
        login(loginParam).then(response => {
          localStorage.setItem('TENANT_ID', response.data.userInfo.tenantId)
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
     * 手机登录
     *
     * @param commit
     * @param phoneLogin
     * @returns {Promise<>}
     * @constructor
     */
    phoneLogin ({ commit }, phoneLogin) {
      const loginParam = {
        phone: phoneLogin.phone.trim(),
        code: phoneLogin.code.trim()
      }
      return new Promise((resolve, reject) => {
        sms(loginParam).then(response => {
          localStorage.setItem('TENANT_ID', response.data.userInfo.tenantId)
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
    },
    /**
     * 获取用户信息
     *
     * @param commit
     * @param state
     */
    userInfo ({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        userInfo().then((response) => {
          debugger
          commit('setAuthorities', response.data.authorities)
          commit('setUserInfo', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    /**
     * 获取登录用户名
     *
     * @param state
     * @returns {*|string}
     */
    getLoginUser (state) {
      return state.userInfo ? state.userInfo.username : ''
    }
  }
}
