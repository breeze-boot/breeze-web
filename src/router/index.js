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

router.beforeEach((to, from, next) => {
  // 去首页登录页放行
  if (to.path === '/' || to.path === '/login') {
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
    next('/?redirect=' + to.path)
  }
})

export default router
