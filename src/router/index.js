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
  if (to.path === '/' || to.path === '/login') {
    next()
  } else {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      if (!store.state.menu.isLoadMenu) {
        store.commit('menu/isLoadMenu', true)
        store.dispatch('menu/loadRoute')
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

export default router
