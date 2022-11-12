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

export const setMenu = (menus) => {
  menus.forEach(menu => {
    const route = menuToRoute(menu)
    if (route) {
      store.commit('menu/setKeepAliveMenus', menus)
      router.addRoute('home', route)
    }
    if (!menu.children) {
      return
    }
    setMenu(menu.children)
  })
}

export const convertMenus = (menus) => {
  menus.forEach(menu => {
    if (!menu.children) {
      return
    }
    setMenu(menu.children)
  })
}
