import Vue from 'vue'
import Vuex from 'vuex'
import { filterTree } from '@utils/common'
import { listTreeMenu } from '@/api/system/menu'
import { bindMenu, bindRoute } from '@/router/remote-dy-route'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    menus: [],
    keepAliveMenus: [],
    menuCollapse: {
      isCollapse: true,
      fadeIn: 'fadeIn',
      whitespace: '200'
    },
    currentMenu: 'welcome'
  },
  mutations: {
    setMenus: (state, menus) => {
      state.menus = menus
    },
    setKeepAliveMenus: (state, menu) => {
      // 过滤出哪些路由需要缓存
      if (menu.keepAlive === 1) {
        state.keepAliveMenus.push(menu.component.substr(menu.component.lastIndexOf('/') + 1))
      }
    },
    setMenuCollapse: (state, menuCollapse) => {
      state.menuCollapse.whitespace = menuCollapse.whitespace
      state.menuCollapse.isCollapse = menuCollapse.isCollapse
      state.menuCollapse.fadeIn = menuCollapse.fadeIn
    },
    setCurrentMenu: (state, menu) => {
      if (menu.hidden === 1) {
        return
      }
      state.currentMenu = menu.name
    },
    clearMenus: (state) => {
      state.menus = []
    }
  },
  actions: {
    /**
     * 动态获取路由
     *
     * @param context
     * @returns {Promise<>}
     */
    loadRoute (context) {
      return new Promise((resolve, reject) => {
        listTreeMenu({
          platformCode: 'managementCenter'
        }).then(response => {
          // 动态绑定路由
          bindRoute(response.data)
          // 动态绑定菜单
          bindMenu(response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
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
