import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useSvgIconRender } from '@sa/hooks'
import { $t } from ':/locales'
import SvgIcon from ':/components/custom/svg-icon.vue'
import type { Breadcrumb, ElegantConstRoute, LastLevelRouteKey, Menu, RouteKey, RouteMap } from ':/types'

/**
 * Filter auth routes by roles
 *
 * @param routes Auth routes
 * @param roles Roles
 */
export function filterAuthRoutesByRoles(
  routes: ElegantConstRoute[],
  roles: string[],
  serverMenuMap: Map<string, any>,
) {
  const SUPER_ROLE = 'R_SUPER'

  // if the user is super admin, then it is allowed to access all routes
  if (roles?.includes(SUPER_ROLE)) {
    return routes
  }

  return routes.flatMap(route =>
    filterAuthRouteByRoles(route, roles, serverMenuMap),
  )
}

/**
 * Filter auth route by roles
 *
 * @param route Auth route
 * @param roles Roles
 */
function filterAuthRouteByRoles(
  route: ElegantConstRoute,
  roles: string[],
  serverMenuMap: Map<string, TODO>,
) {
  const routeRoles = (route.meta && route.meta.roles) || []

  // // if the route's "roles" is empty, then it is allowed to access
  // if (!routeRoles.length)
  //   return [route]

  // if the user's role is included in the route's "roles", then it is allowed to access
  const hasPermission = routeRoles.some(role => roles.includes(role))

  const filterRoute = { ...route }

  if (filterRoute.children?.length) {
    filterRoute.children = filterRoute.children.flatMap(item =>
      filterAuthRouteByRoles(item, roles, serverMenuMap),
    )
  }

  if (hasPermission) {
    const meta = filterRoute.meta

    if (meta?.id) {
      const serverMenu = serverMenuMap.get(meta.id as string)
      filterRoute.meta = {
        ...meta,
        ...serverMenu?.definition.meta,
        icon: meta.icon,
        order: serverMenu?.order,
      }
    }
  }

  return hasPermission ? [filterRoute] : []
}

/**
 * Sort route by order
 *
 * @param route Route
 */
function sortRouteByOrder(route: ElegantConstRoute) {
  if (route.children?.length) {
    route.children.sort(
      (next, prev) =>
        (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0),
    )
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * Sort routes by order
 *
 * @param routes Routes
 */
export function sortRoutesByOrder(routes: ElegantConstRoute[]) {
  routes.sort(
    (next, prev) =>
      (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0),
  )
  routes.forEach(sortRouteByOrder)

  return routes
}

/**
 * Get global menus by auth routes
 *
 * @param routes Auth routes
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]) {
  const menus: Menu[] = []

  routes.forEach((route) => {
    if (!route.meta?.hideInMenu) {
      const menu = getGlobalMenuByBaseRoute(route)

      if (route.children?.some(child => !child.meta?.hideInMenu)) {
        menu.children = getGlobalMenusByAuthRoutes(route.children)
      }

      menus.push(menu)
    }
  })

  return menus
}

/**
 * Update locale of global menus
 *
 * @param menus
 */
export function updateLocaleOfGlobalMenus(menus: Menu[]) {
  const result: Menu[] = []

  menus.forEach((menu) => {
    const { i18nKey, label, children } = menu

    const newLabel = i18nKey ? $t(i18nKey) : label

    const newMenu: Menu = {
      ...menu,
      label: newLabel,
    }

    if (children?.length) {
      newMenu.children = updateLocaleOfGlobalMenus(children)
    }

    result.push(newMenu)
  })

  return result
}

/**
 * Get global menu by route
 *
 * @param route
 */
function getGlobalMenuByBaseRoute(
  route: RouteLocationNormalizedLoaded | ElegantConstRoute,
) {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon)

  const { name, path } = route
  const {
    title,
    i18nKey,
    icon = '', // TODO
    localIcon,
  } = route.meta ?? {}

  const label = i18nKey ? $t(i18nKey) : title!

  const menu: Menu = {
    key: name as string,
    label,
    i18nKey,
    routeKey: name as RouteKey,
    routePath: path as RouteMap[RouteKey],
    icon: SvgIconVNode({ icon, localIcon, fontSize: 20 }),
  }

  return menu
}

/**
 * Get cache route names
 *
 * @param routes Vue routes (two levels)
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: LastLevelRouteKey[] = []

  routes.forEach((route) => {
    // only get last two level route, which has component
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as LastLevelRouteKey)
      }
    })
  })

  return cacheNames
}

/**
 * Is route exist by route name
 *
 * @param routeName
 * @param routes
 */
export function isRouteExistByRouteName(
  routeName: RouteKey,
  routes: ElegantConstRoute[],
) {
  return routes.some(route =>
    recursiveGetIsRouteExistByRouteName(route, routeName),
  )
}

/**
 * Recursive get is route exist by route name
 *
 * @param route
 * @param routeName
 */
function recursiveGetIsRouteExistByRouteName(
  route: ElegantConstRoute,
  routeName: RouteKey,
) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some(item =>
      recursiveGetIsRouteExistByRouteName(item, routeName),
    )
  }

  return isExist
}

/**
 * Get selected menu key path
 *
 * @param selectedKey
 * @param menus
 */
export function getSelectedMenuKeyPathByKey(
  selectedKey: string,
  menus: Menu[],
) {
  const keyPath: string[] = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path!)
    }

    return find
  })

  return keyPath
}

/**
 * Find menu path
 *
 * @param targetKey Target menu key
 * @param menu Menu
 */
function findMenuPath(targetKey: string, menu: Menu): string[] | null {
  const path: string[] = []

  function dfs(item: Menu): boolean {
    path.push(item.key)

    if (item.key === targetKey) {
      return true
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }

    path.pop()

    return false
  }

  if (dfs(menu)) {
    return path
  }

  return null
}

/**
 * Transform menu to breadcrumb
 *
 * @param menu
 */
function transformMenuToBreadcrumb(menu: Menu) {
  const { children, ...rest } = menu

  const breadcrumb: Breadcrumb = {
    ...rest,
  }

  if (children?.length) {
    breadcrumb.options = children.map(transformMenuToBreadcrumb)
  }

  return breadcrumb
}

/**
 * Get breadcrumbs by route
 *
 * @param route
 * @param menus
 */
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  menus: Menu[],
): Breadcrumb[] {
  const key = route.name as string
  const activeKey = route.meta?.activeMenu

  const menuKey = activeKey || key

  for (const menu of menus) {
    if (menu.key === menuKey) {
      const breadcrumbMenu
        = menuKey !== activeKey ? menu : getGlobalMenuByBaseRoute(route)

      return [transformMenuToBreadcrumb(breadcrumbMenu)]
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children)
      if (result.length > 0) {
        return [transformMenuToBreadcrumb(menu), ...result]
      }
    }
  }

  return []
}
