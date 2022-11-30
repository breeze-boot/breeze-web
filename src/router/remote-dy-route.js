import store from '@/store'
import router from '@/router/index'

/**
 * 转换路由
 *
 * @param menu
 * @returns {{path, meta: {hidden, icon, title}, name}|null}
 */
const menuToRoute = (menu = {}) => {
  if (!menu.component) {
    return null
  }

  const route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title,
      hidden: menu.hidden
    }
  }
  route.component = loadComponent(menu.component)
  return route
}

/**
 * 转换组件
 *
 * @param component
 * @returns {function(): Promise<*>}
 */
const loadComponent = (component) => {
  // return (resolve) => require([`@/views${viewName}.vue`], resolve)
  return () => import(`@/views${component}`)
}

/**
 * @param menus
 */
export const filterRouteMenu = (menus) => {
  menus.forEach(menu => {
    addRoute(menu)
    if (!menu.children) {
      return
    }
    filterRouteMenu(menu.children)
  })
}

/**
 * @param menus
 */
export const convertMenus = (menus) => {
  menus.forEach(menu => {
    addRoute(menu)
    if (!menu.children) {
      return
    }
    filterRouteMenu(menu.children)
  })
}

const addRoute = (menu) => {
  if (menu.type !== 1) {
    return
  }
  const route = menuToRoute(menu)
  if (route) {
    store.commit('menu/setKeepAliveMenus', menu)
    router.addRoute('home', route)
  }
}
