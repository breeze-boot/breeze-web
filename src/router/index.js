import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

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
    path: '/auth-redirect',
    component: () => import('@/views/AuthRedirectView.vue'),
    hidden: true
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
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/NotFoundView.vue'),
        meta: {
          title: '404',
          hidden: 1
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

const whiteList = ['/404', '/auth-redirect']

router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    console.debug(`白名单${whiteList}`)
    next()
    return
  }
  // 去首页登录页放行
  if (to.path === '/' || to.path === '/login') {
    console.debug(`登录页${to.path}`)
    next()
    return
  }
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    if (store.state.menu.isLoadMenu) {
      next()
      return
    }
    store.commit('menu/isLoadMenu', true)
    store.dispatch('menu/loadRoute').then(() => {
      console.debug('加载完成路由')
      next({
        ...to,
        replace: true
      })
    }).catch(err => {
      store.dispatch('userInfo/logOut').then(() => {
        console.error(err)
        next({ path: '/' })
      })
    })
  } else {
    console.debug('重定向路由')
    next('/?redirect=' + to.path)
  }
})

export default router
