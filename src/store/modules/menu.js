import Vue from 'vue'
import Vuex from 'vuex'
import { filterTree } from '@/utils/constant'
import { listTreeMenu } from '@/api/sys/menu'
import { bindMenu, bindRoute } from '@/router/remote-dy-route'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    menus: [],
    keepAliveMenus: [],
    menuIsCollapse: {
      isCollapse: true,
      fadeIn: 'fadeIn',
      collapseWhitespace: '200'
    },
    currentMenu: 'welcome',
    isLoadMenu: false
  },
  mutations: {
    setMenus: (state, menus) => {
      state.menus = menus
    },
    setKeepAliveMenus: (state, menu) => {
      // 过滤出哪些路由需要缓存
      if (menu.keepAlive === 1) {
        state.keepAliveMenus =
          menu.component.substr(menu.component.lastIndexOf('/') + 1)
      }
    },
    setMenuIsCollapse: (state, menuIsCollapse) => {
      state.menuIsCollapse.collapseWhitespace = menuIsCollapse.collapseWhitespace
      state.menuIsCollapse.isCollapse = menuIsCollapse.isCollapse
      state.menuIsCollapse.fadeIn = menuIsCollapse.fadeIn
    },
    isLoadMenu: (state, isLoadMenu) => {
      state.isLoadMenu = isLoadMenu
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
        if (context.rootGetters['menu/getMenus'].length === 0 || !context.rootGetters['menu/isLoadMenu']) {
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
        }
      })
    }
  },
  getters: {
    getMenus (state) {
      const result = []
      filterTree(state.menus, result, (tree) => tree.hidden === 1)
      return result
    },
    isLoadMenu (state) {
      return state.isLoadMenu
    }
  }
}
