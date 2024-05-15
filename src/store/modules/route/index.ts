import { computed, ref, shallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { useAppStore } from '../app'
import { useAuthStore } from '../auth'
import { useTabStore } from '../tab'
import {
  filterAuthRoutesByRoles,
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  updateLocaleOfGlobalMenus,
} from './shared'
import { useBoolean } from ':/hooks'
import { SetupStoreId } from ':/enum'
import type {
  ElegantConstRoute,
  Menu,
  RouteKey,
  RoutePath,
  ServerMenu,
  ServerMenuDefinition,
} from ':/types'
import { APP_INST, hooks } from ':/global'

export type ServerMenuMap = Map<string, ServerMenuDefinition>

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const appStore = useAppStore()
  const tabStore = useTabStore()
  const authStore = useAuthStore()
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()
  const removeRouteFns: (() => void)[] = []
  const menus = ref<Menu[]>([])
  // id -> RawMenuMeta
  const serverMenuDefinitions = shallowRef<ServerMenuMap>(new Map())
  const routeHome = ref(APP_INST.config.global.home || 'entry')
  const cacheRoutes = ref<RouteKey[]>([])

  async function initServerMenus() {
    // For old system, routes has already generated, so, this function just map the serverRoutes to get some meta data like: id, name, and collect id as rules what means: if serverMenus has this id, the routes from elegant can be show.
    const routes = await APP_INST.config.global.serverMenusGetter()

    if (routes) {
      serverMenuDefinitions.value = createServerMenuMap(routes)
      authStore.updateUserRoles(
        [...serverMenuDefinitions.value.keys()].concat(
          APP_INST.config.global.hiddenMenus ?? [],
        ),
      )
    }
  }

  function getGlobalMenus(routes: ElegantConstRoute[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes)
  }

  function updateGlobalMenusByLocale() {
    menus.value = updateLocaleOfGlobalMenus(menus.value)
  }

  function getCacheRoutes(routes: RouteRecordRaw[]) {
    const { constantVueRoutes } = APP_INST.config.transform.createRoutes()

    cacheRoutes.value = getCacheRouteNames([...constantVueRoutes, ...routes])
  }

  function addCacheRoutes(routeKey: RouteKey) {
    if (cacheRoutes.value.includes(routeKey)) {
      return
    }

    cacheRoutes.value.push(routeKey)
  }

  function removeCacheRoutes(routeKey: RouteKey) {
    const index = cacheRoutes.value.findIndex(item => item === routeKey)

    if (index === -1) {
      return
    }

    cacheRoutes.value.splice(index, 1)
  }

  async function reCacheRoutesByKey(routeKey: RouteKey) {
    removeCacheRoutes(routeKey)

    await appStore.reloadPage()

    addCacheRoutes(routeKey)
  }

  async function reCacheRoutesByKeys(routeKeys: RouteKey[]) {
    for await (const key of routeKeys) {
      await reCacheRoutesByKey(key)
    }
  }

  const breadcrumbs = computed(() =>
    getBreadcrumbsByRoute(
      APP_INST.config.router.currentRoute.value,
      menus.value,
    ),
  )

  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()

    resetVueRoutes()
  }

  function resetVueRoutes() {
    removeRouteFns.forEach(fn => fn())
    removeRouteFns.length = 0
  }

  async function initAuthRoute() {
    await initStaticAuthRoute()

    // TODO
    await hooks.callHook('beforeInit')

    tabStore.initHomeTab()
  }

  async function initStaticAuthRoute() {
    const { authRoutes } = APP_INST.config.transform.createRoutes()

    await initServerMenus()

    const authedRoutes = filterAuthRoutesByRoles(
      authRoutes,
      authStore.userRoles,
      serverMenuDefinitions.value,
    )

    handleAuthRoutes(authedRoutes)

    setIsInitAuthRoute(true)
  }

  function handleAuthRoutes(routes: ElegantConstRoute[]) {
    const sortRoutes = sortRoutesByOrder(routes)

    const vueRoutes = APP_INST.config.transform.getAuthVueRoutes(sortRoutes)

    addRoutesToVueRouter(vueRoutes)

    getGlobalMenus(sortRoutes)

    getCacheRoutes(vueRoutes)
  }

  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      const removeFn = APP_INST.config.router.addRoute(route)
      addRemoveRouteFn(removeFn)
    })
  }

  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  async function getIsAuthRouteExist(routePath: RoutePath) {
    const routeName = APP_INST.config.transform.getRouteName(routePath as TODO)

    if (!routeName) {
      return false
    }

    const { authRoutes } = APP_INST.config.transform.createRoutes()

    return isRouteExistByRouteName(routeName, authRoutes)
  }

  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value)
  }

  return {
    resetStore,
    routeHome,
    menus,
    updateGlobalMenusByLocale,
    cacheRoutes,
    reCacheRoutesByKey,
    reCacheRoutesByKeys,
    breadcrumbs,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath,
    getServerRawRoutes: initServerMenus,
  }
})

export function createServerMenuMap(
  menus: ServerMenu[],
  map: ServerMenuMap = new Map(),
): ServerMenuMap {
  menus.forEach((m, index) => {
    const key = m.meta.id

    if (key) {
      if (map.has(key)) {
        console.error(`Duplicated key in menus is ${key}, Please check.`)
      }

      map.set(key, {
        order: index,
        definition: m,
      })
    }

    if (m.children?.length) {
      createServerMenuMap(m.children, map)
    }
  })

  return map
}
