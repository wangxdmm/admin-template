import type { RouteComponent, RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'
import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
  RoutePath,
  SystemConfig,
} from ':/types'

/** Create global route transformer for elegant-router */
export function transformCreator(options: {
  config?: SystemConfig
  layouts: Record<string, Component>
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>
  routeMap: RouteMap
  customRoutes: ElegantConstRoute[]
  generatedRoutes: ElegantConstRoute[]
}) {
  const {
    layouts,
    views,
    customRoutes = [],
    generatedRoutes = [],
    routeMap,
  } = options

  return {
    transformElegantRouteToVueRoute,
    transformElegantRoutesToVueRoutes,
    getRoutePath,
    getRouteName,
    createRoutes,
    getAuthVueRoutes,
  }

  function transformElegantRoutesToVueRoutes(routes: ElegantConstRoute[]) {
    return routes.flatMap((route) => transformElegantRouteToVueRoute(route))
  }

  function transformElegantRouteToVueRoute(route: ElegantConstRoute) {
    const LAYOUT_PREFIX = 'layout.'
    const VIEW_PREFIX = 'view.'
    const ROUTE_DEGREE_SPLITTER = '_'
    const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$'

    function isLayout(component: string) {
      return component.startsWith(LAYOUT_PREFIX)
    }

    function getLayoutName(component: string) {
      return component.replace(LAYOUT_PREFIX, '')
    }

    function isView(component: string) {
      return component.startsWith(VIEW_PREFIX)
    }

    function getViewName(component: string) {
      return component?.replace(VIEW_PREFIX, '')
    }

    function isFirstLevelRoute(item: ElegantConstRoute) {
      return !item.name.includes(ROUTE_DEGREE_SPLITTER)
    }

    function isSingleLevelRoute(item: ElegantConstRoute) {
      return isFirstLevelRoute(item) && !item.children?.length
    }

    function getSingleLevelRouteComponent(component: string) {
      const [layout, view] = component.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT)

      return {
        layout: getLayoutName(layout),
        view: getViewName(view),
      }
    }

    const vueRoutes: RouteRecordRaw[] = []

    // add props: true to route
    if (route.path.includes(':') && !route.props) {
      route.props = true
    }

    const { name, path, component, children, ...rest } = route

    const vueRoute = { name, path, ...rest } as RouteRecordRaw

    if (component) {
      if (isSingleLevelRoute(route)) {
        const { layout, view } = getSingleLevelRouteComponent(component)

        const singleLevelRoute: RouteRecordRaw = {
          path,
          component: layouts[layout],
          children: [
            {
              name,
              path: '',
              component: views[view],
              ...rest,
            } as RouteRecordRaw,
          ],
        }

        return [singleLevelRoute]
      }

      if (isLayout(component)) {
        const layoutName = getLayoutName(component)

        vueRoute.component = layouts[layoutName]
      }

      if (isView(component)) {
        const viewName = getViewName(component)

        vueRoute.component = views[viewName]
      }
    }

    // add redirect to child
    if (children?.length && !vueRoute.redirect) {
      vueRoute.redirect = {
        name: children[0].name,
      }
    }

    if (children?.length) {
      const childRoutes = children.flatMap((child) =>
        transformElegantRouteToVueRoute(child),
      )

      if (isFirstLevelRoute(route)) {
        vueRoute.children = childRoutes
      } else {
        vueRoutes.push(...childRoutes)
      }
    }

    vueRoutes.unshift(vueRoute)

    return vueRoutes
  }

  function getRoutePath<T extends RouteKey>(name: T) {
    return routeMap[name]
  }

  function getRouteName(path: RoutePath) {
    const routeEntries = Object.entries(routeMap) as [RouteKey, RoutePath][]

    const routeName: RouteKey | null =
      routeEntries.find(([, routePath]) => routePath === path)?.[0] || null

    return routeName
  }

  /** Create routes */
  function createRoutes() {
    const constantRoutes: ElegantConstRoute[] = []
    const authRoutes: ElegantConstRoute[] = []

    ;[...customRoutes, ...(generatedRoutes as ElegantConstRoute[])].forEach(
      (item) => {
        if (item.meta?.constant) {
          constantRoutes.push(item)
        } else {
          authRoutes.push(item)
        }
      },
    )

    const constantVueRoutes = transformElegantRoutesToVueRoutes(constantRoutes)

    return {
      constantVueRoutes,
      authRoutes,
    }
  }

  function getAuthVueRoutes(routes: ElegantConstRoute[]) {
    return transformElegantRoutesToVueRoutes(routes)
  }
}
