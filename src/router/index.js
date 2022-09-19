import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

import { listTreeMenu } from '@/api/admin/menu'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/WelcomeView.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export const loadRoute = () => {
  const params = {
    platformCode: 'managementCenter'
  }
  listTreeMenu(params).then((response) => {
    if (!response.data) {
      return
    }
    store.commit('menu/setMenus', response.data)
    // 动态绑定路由
    response.data.forEach(menu => {
      if (!menu.children) {
        return
      }
      getMenu(menu.children)
    })
  })
}

export const getMenu = (menus) => {
  menus.forEach(menu => {
    const route = menuToRoute(menu)
    if (route) {
      router.addRoute('home', route)
    }
    if (!menu.children) {
      return
    }
    getMenu(menu.children)
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.path === '/') {
    next()
  } else if (to.path === '/login') {
    next()
  } else {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      debugger
      if (!store.state.menu.isLoadMenu) {
        loadRoute()
        store.commit('menu/isLoadMenu', true)
      }
      next()
    } else {
      next('/')
      Element.Message.error('您还没有登录，请先登录')
    }
  }
})

/**
 *
 * @param userRouter
 * @param allRouter
 * @returns {*[]}
 */
export const filterMenu = (userRouter, allRouter) => {
  const routers = []
  allRouter.forEach((allK, allV) => {
    userRouter.forEach((userK, userV) => {
      if (userK.name === allK.name) {
        if (userK.children && userK.children.length > 0) {
          filterMenu(allK, allV)
        }
        routers.push(allK)
      }
    })
  })
  return routers
}

// 导航转成路由
const menuToRoute = (menu) => {
  if (!menu.component) {
    return null
  }

  const route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = loadView(menu.component)
  return route
}

export const loadView = (component) => {
  // return (resolve) => require([`@/views${viewName}.vue`], resolve)
  return () => import(`@/views${component}`)
}

export default router
