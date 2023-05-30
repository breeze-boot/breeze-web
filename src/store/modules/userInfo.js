import Vue from 'vue'
import Vuex from 'vuex'
import { login, userInfo } from '@/api/login'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    userInfo: JSON.parse(localStorage.getItem('user_info')),
    tenantId: localStorage.getItem('X-TENANT-ID'),
    accessToken: localStorage.getItem('access_token'),
    expiresIn: localStorage.getItem('expiresIn'),
    authorities: localStorage.getItem('authorities')
  },
  mutations: {
    setUserInfo: (state, userInfo) => {
      localStorage.setItem('user_info', JSON.stringify(userInfo))
      state.userInfo = userInfo
    },
    setTenantId: (state, tenantId) => {
      localStorage.setItem('TENANT_ID', tenantId)
      state.tenantId = tenantId
    },
    setAccessToken: (state, accessToken) => {
      localStorage.setItem('access_token', accessToken)
      state.accessToken = accessToken
    },
    setExpiresIn: (state, expiresIn) => {
      localStorage.setItem('expires_in', expiresIn)
      state.expiresIn = expiresIn
    },
    setAuthorities: (state, authorities) => {
      const authority = authorities.map(value => {
        return value.authority
      })
      localStorage.setItem('authorities', authority)
      state.authorities = authority
    }
  },
  actions: {
    /**
     * 登录
     *
     * @param commit
     * @param params
     * @returns {Promise<>}
     * @constructor
     */
    authLogin ({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params.params, params.grantType).then(response => {
          commit('setTenantId', response.user_info.tenantId)
          commit('setAccessToken', response.access_token)
          commit('setExpiresIn', response.expires_in)
          commit('setAuthorities', response.user_info.authorities)
          commit('setUserInfo', response.user_info)
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
        commit('setTenantId', '')
        commit('setAccessToken', '')
        commit('setExpiresIn', '')
        commit('setAuthorities', [])
        commit('setUserInfo', {})
        resolve()
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
          commit('setAuthorities', response.authorities)
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
    getLoginName (state) {
      return state.userInfo ? state.userInfo.username : ''
    }
  }
}
