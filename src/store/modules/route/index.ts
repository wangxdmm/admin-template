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
import { useBoolean } from ':/global-hooks/src'
import { SetupStoreId } from ':/enum'
import { getRouteName } from ':/transform'
import type {
  ElegantConstRoute,
  Menu,
  RouteKey,
  RoutePath,
  ServerMenu,
  ServerMenuDefinition,
} from ':/types'
import { storeCreatorCreator } from ':/store/share'

export type ServerMenuMap = Map<string, ServerMenuDefinition>

let _useRouteStore: ReturnType<typeof routeStoreCreator>

export const useRouteStore = () => _useRouteStore()

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

export const routeStoreCreator = storeCreatorCreator(
  config =>
    defineStore(SetupStoreId.Route, () => {
      const appStore = useAppStore()
      const tabStore = useTabStore()
      const authStore = useAuthStore()
      const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute }
        = useBoolean()
      const removeRouteFns: (() => void)[] = []
      const menus = ref<Menu[]>([])
      // id -> RawMenuMeta
      const serverMenuDefinitions = shallowRef<ServerMenuMap>(new Map())
      const routeHome = ref(config.home || 'entry')
      const cacheRoutes = ref<RouteKey[]>([])

      async function initServerMenus() {
        // For old system, routes has already generated, so, this function just map the serverRoutes to get some meta data like: id, name, and collect id as rules what means: if serverMenus has this id, the routes from elegant can be show.
        const routes = await config.router?.getServerRawRoutes()

        if (routes) {
          serverMenuDefinitions.value = createServerMenuMap(routes)
          authStore.updateUserRoles(
            [...serverMenuDefinitions.value.keys()].concat(config.router.hideInMenuRoutes ?? []),
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
        const { constantVueRoutes } = config.router.createRoutes()

        cacheRoutes.value = getCacheRouteNames([
          ...constantVueRoutes,
          ...routes,
        ])
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
          config.router.instance.currentRoute.value,
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

        await authStore.initSystem()

        tabStore.initHomeTab()
      }

      async function initStaticAuthRoute() {
        const { authRoutes } = config.router.createRoutes()

        await initServerMenus()

        const authedRoutes = filterAuthRoutesByRoles(
          authRoutes,
          authStore.userInfo.roles,
          serverMenuDefinitions.value,
        )

        handleAuthRoutes(authedRoutes)

        setIsInitAuthRoute(true)
      }

      function handleAuthRoutes(routes: ElegantConstRoute[]) {
        const sortRoutes = sortRoutesByOrder(routes)

        const vueRoutes = config.router.getAuthVueRoutes(sortRoutes)

        addRoutesToVueRouter(vueRoutes)

        getGlobalMenus(sortRoutes)

        getCacheRoutes(vueRoutes)
      }

      function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
        routes.forEach((route) => {
          const removeFn = config.router.instance.addRoute(route)
          addRemoveRouteFn(removeFn)
        })
      }

      function addRemoveRouteFn(fn: () => void) {
        removeRouteFns.push(fn)
      }

      async function getIsAuthRouteExist(routePath: RoutePath) {
        const routeName = getRouteName(routePath as TODO)

        if (!routeName) {
          return false
        }

        const { authRoutes } = config.router.createRoutes()

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
    }),
  (store) => {
    _useRouteStore = store
  },
)

export type UseRouteStore = typeof useRouteStore
