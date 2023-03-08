import store from '@/store'
import router from '@/router/index'

/**
 * @param menus
 */
export const bindMenu = (menus) => {
  menus.forEach(menu => {
    convertMenu(menu.path, menu.children)
  })
  store.commit('menu/setMenus', menus)
}

export const convertMenu = (path, menus) => {
  menus.forEach(menu => {
    if (menu.href === 1) {
      return
    }
    const tPath = !path ? '' : (path + menu.path)
    menu.path = tPath
    if (!menu.children) {
      return
    }
    convertMenu(tPath, menu.children)
  })
}

/**
 * @param menus
 */
export const bindRoute = (menus) => {
  menus.forEach(menu => {
    addRoute(menu.path, menu)
    if (!menu.children) {
      return
    }
    filterRoute(menu.path, menu.children)
  })
}

/**
 * @param path
 * @param menus
 */
export const filterRoute = (path = '', menus) => {
  menus.forEach(menu => {
    const tPath = !path ? '' : (path + menu.path)
    // 添加路由
    addRoute(tPath, menu)
    if (!menu.children) {
      return
    }
    filterRoute(tPath, menu.children)
  })
}

/**
 * @param path
 * @param menu
 */
const addRoute = (path, menu) => {
  if (menu.type !== 1) {
    return
  }
  const route = convertRoute(path, menu)
  if (route) {
    store.commit('menu/setKeepAliveMenus', menu)
    router.addRoute('home', route)
  }
}

/**
 * 转换路由
 *
 * @param path
 * @param menu
 * @returns {{path, meta: {hidden, icon, title}, name}|null}
 */
const convertRoute = (path = '', menu = {}) => {
  if (!menu.component) {
    return null
  }
  const route = {
    name: menu.name,
    path: path,
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
