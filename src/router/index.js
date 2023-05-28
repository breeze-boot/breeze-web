import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })
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
    path: '/login-redirect',
    component: () => import('@/views/login/AuthRedirectView.vue'),
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/home',
    redirect: '/'
  },
  // 首页，若没有登录前置路由会拦截到登录页
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/welcome/index.vue')
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/NotFound.vue'),
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

const whiteList = ['/404', '/login-redirect', '/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    // 有token了，不是去登录页的去执行获取菜单逻辑
    if (store.getters['menu/getMenus'].length > 0) {
      next()
      return
    }
    store.dispatch('menu/loadRoute').then(() => {
      console.debug('加载完成路由')
      next({
        ...to,
        replace: true
      })
    }).catch(err => {
      console.error(`加载路由异常${err}`)
      this.$message.error('加载路由异常')
      // 异常直接跳转到登录页
      next({ path: '/login' })
    })
  } else {
    if (whiteList.includes(to.path)) {
      console.debug(`白名单${whiteList}`)
      next()
      return
    }

    if (to.path === '/') {
      next({ path: '/login' })
      return
    }
    next(`/login?redirect=${to.fullPath}`)
  }
})

/**
 * 全局后置守卫
 */
router.afterEach((to, from, next) => {
  NProgress.done()
})

export default router
