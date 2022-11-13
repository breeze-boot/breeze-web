import Vue from 'vue'
import Vuex from 'vuex'
import { filterTree } from '@/utils/constant'
import { listTreeMenu } from '@/api/sys/menu'
import { convertMenus } from '@/router/remote-dy-route'
import router from '@/router/index'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    menus: [],
    keepAliveMenus: [],
    currentMenu: 'welcome',
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
    setCurrentMenu (state, menu) {
      if (menu.hidden === 1) {
        return
      }
      state.currentMenu = menu.name
    },
    clearMenus (state) {
      state.menus = []
    }
  },
  actions: {
    /**
     * 获取菜单完成后跳转首页
     *
     * @param context
     */
    loadRoute (context) {
      listTreeMenu({
        platformCode: 'managementCenter'
      }).then(rep => {
        if (rep.code === 0) {
          return
        }
        // 动态绑定路由
        if (context.state.menus.length === 0 || !context.state.isLoadMenu) {
          convertMenus(rep.data)
        }
        context.state.menus = rep.data
        let path = router.app._route.query.redirect
        const name = localStorage.getItem('current_tag_name')
        if (!path && name) {
          path = name
        }
        router.replace(path === '/' || path === undefined ? 'welcome' : path)
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
