import Vue from 'vue'
import Vuex from 'vuex'
import { filterTree } from '@/utils/constant'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    menus: [],
    keepAliveMenus: [],
    isCollapse: true,
    fadeIn: 'fadeIn',
    collapseWhitespace: '200',
    isLoadMenu: false
  },
  mutations: {
    setMenus (state, menus) {
      state.menus = menus
    },
    setKeepAliveMenus (state, menus) {
      // 过滤出哪些路由需要缓存
      state.keepAliveMenus = menus.filter((item) => {
        return item.keepAlive === 1
      }).map(m => {
        return m.component.substr(m.component.lastIndexOf('/') + 1)
      })
    },
    setCollapse (state, isCollapse) {
      state.isCollapse = isCollapse
    },
    setFadeIn (state, fadeIn) {
      state.fadeIn = fadeIn
    },
    setCollapseWhitespace (state, collapseWhitespace) {
      state.collapseWhitespace = collapseWhitespace
    },
    isLoadMenu (state, isLoadMenu) {
      state.isLoadMenu = isLoadMenu
    },
    clearMenus (state) {
      state.menus = []
    }
  },
  actions: {},
  getters: {
    getMenus (state) {
      const result = []
      filterTree(state.menus, result, (tree) => tree.hidden === 1)
      return result
    }
  }
}
