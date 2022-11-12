import Vue from 'vue'
import Vuex from 'vuex'
import { filterTree } from '@/utils/constant'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    // Tag
    currentTagValue: 'welcome',
    dynamicTags: [{
      title: '欢迎',
      name: 'welcome',
      hidden: 0
    }],
    // Tab
    currentTabValue: 'welcome',
    dynamicTabs: [{
      title: '欢迎',
      name: 'welcome',
      hidden: 0
    }],
    // 菜单
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
    setTag (state, menu) {
      if (state.hidden === 0) {
        if (menu.name === 'welcome') {
          menu.title = '欢迎'
        }
        state.currentTagValue = menu.name
      }
      if (state.dynamicTags.filter((item) => item.name === menu.name).length > 0) {
        return
      }
      state.dynamicTags.push(menu)
    },
    setCurrentTagValue (state, name) {
      state.currentTagValue = name
    },
    setTab (state, menu) {
      if (state.hidden === 0) {
        if (menu.name === 'welcome') {
          menu.title = '欢迎'
        }
        state.currentTagValue = menu.name
      }
      if (state.dynamicTabs.filter((item) => item.name === menu.name).length > 0) {
        return
      }
      state.dynamicTabs.push(menu)
    },
    setCurrentTabValue (state, name) {
      state.currentTabValue = name
    }
  },
  actions: {
    clearMenus (state) {
      state.menus = []
    }
  },
  getters: {
    getMenus (state) {
      const result = []
      filterTree(state.menus, result, (tree) => tree.hidden === 1)
      return result
    }
  }
}
