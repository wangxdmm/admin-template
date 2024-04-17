import { computed, ref, shallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { useBoolean } from '@sa/hooks'
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
import { SetupStoreId } from ':/enum'
import { router } from ':/router'
import { createRoutes, getAuthVueRoutes } from ':/router/routes'
import { getRouteName } from ':/router/transform'
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

export const useRouteStore = _useRouteStore!

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
      const authRouteMode = ref('static')

      /** Home route key */
      const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

      function flattenMenus(
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
            flattenMenus(m.children, map)
          }
        })

        return map
      }

      async function initServerRawRoutes() {
        const routes = await config.store.getServerRawRoutes()
        if (routes) {
          serverMenuDefinitions.value = flattenMenus(routes)
          authStore.updateUserRoles([...serverMenuDefinitions.value.keys()])
        }
      }

      /** Get global menus */
      function getGlobalMenus(routes: ElegantConstRoute[]) {
        menus.value = getGlobalMenusByAuthRoutes(routes)
      }

      /** Update global menus by locale */
      function updateGlobalMenusByLocale() {
        menus.value = updateLocaleOfGlobalMenus(menus.value)
      }

      /** Cache routes */
      const cacheRoutes = ref<RouteKey[]>([])

      function getCacheRoutes(routes: RouteRecordRaw[]) {
        const { constantVueRoutes } = createRoutes()

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

      /** Global breadcrumbs */
      const breadcrumbs = computed(() =>
        getBreadcrumbsByRoute(router.currentRoute.value, menus.value),
      )

      /** Reset store */
      async function resetStore() {
        const routeStore = useRouteStore()

        routeStore.$reset()

        resetVueRoutes()
      }

      /** Reset vue routes */
      function resetVueRoutes() {
        removeRouteFns.forEach(fn => fn())
        removeRouteFns.length = 0
      }

      /** Init auth route */
      async function initAuthRoute() {
        if (authRouteMode.value === 'static') {
          await initStaticAuthRoute()
        }
        else {
          await initDynamicAuthRoute()
        }

        await authStore.initSystem()

        tabStore.initHomeTab()
      }

      /** Init static auth route */
      async function initStaticAuthRoute() {
        const { authRoutes } = createRoutes()

        await initServerRawRoutes()

        const filteredAuthRoutes = filterAuthRoutesByRoles(
          authRoutes,
          authStore.userInfo.roles,
          serverMenuDefinitions.value,
        )

        handleAuthRoutes(filteredAuthRoutes)

        // const firstRoute = get(filteredAuthRoutes, '0.children.0.name')

        // setRouteHome(firstRoute || get(filteredAuthRoutes, '0.name'))

        setIsInitAuthRoute(true)
      }

      /** Init dynamic auth route */
      async function initDynamicAuthRoute() {
        // const { data, error } = await fetchGetUserRoutes()
        // if (!error) {
        //   const { routes, home } = data
        //   handleAuthRoutes(routes)
        //   setRouteHome(home)
        //   handleUpdateRootRouteRedirect(home)
        //   setIsInitAuthRoute(true)
        // }
        // await userNormal.menus({
        //   code: import.meta.env.VITE_APP_CODE,
        // })()
      }

      function handleAuthRoutes(routes: ElegantConstRoute[]) {
        const sortRoutes = sortRoutesByOrder(routes)

        const vueRoutes = getAuthVueRoutes(sortRoutes)

        addRoutesToVueRouter(vueRoutes)

        getGlobalMenus(sortRoutes)

        getCacheRoutes(vueRoutes)
      }

      function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
        routes.forEach((route) => {
          const removeFn = router.addRoute(route)
          addRemoveRouteFn(removeFn)
        })
      }

      /**
       * Add remove route fn
       *
       * @param fn
       */
      function addRemoveRouteFn(fn: () => void) {
        removeRouteFns.push(fn)
      }

      // // eslint-disable-next-line unused-imports/no-unused-vars
      // function handleUpdateRootRouteRedirect(redirectKey: LastLevelRouteKey) {
      //   const redirect = getRoutePath(redirectKey)

      //   if (redirect) {
      //     const rootRoute: CustomRoute = { ...ROOT_ROUTE, redirect }

      //     router.removeRoute(rootRoute.name)

      //     const [rootVueRoute] = getAuthVueRoutes([rootRoute])

      //     router.addRoute(rootVueRoute)
      //   }
      // }

      async function getIsAuthRouteExist(routePath: RoutePath) {
        const routeName = getRouteName(routePath as TODO)

        if (!routeName) {
          return false
        }

        if (authRouteMode.value === 'static') {
          const { authRoutes } = createRoutes()

          return isRouteExistByRouteName(routeName, authRoutes)
        }

        // const { data } = await fetchIsRouteExist(routeName)

        // return data

        return {}
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
        getServerRawRoutes: initServerRawRoutes,
      }
    }),
  (store) => {
    _useRouteStore = store
  },
)
