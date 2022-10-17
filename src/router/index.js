import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

import { listTreeMenu } from '@/api/system/menu'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

VueRouter.prototype.replace = function replace (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/login',
    redirect: '/'
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
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
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
      store.commit('menu/setKeepAliveMenus', menus)
      router.addRoute('home', route)
    }
    if (!menu.children) {
      return
    }
    getMenu(menu.children)
  })
}

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login') {
    next()
  } else {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      if (!store.state.menu.isLoadMenu) {
        loadRoute()
        store.commit('menu/isLoadMenu', true)
        next({
          ...to, // next({ ...to })的目的,是保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
      } else {
        next()
      }
    } else {
      next('/?redirect=' + to.path)
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
