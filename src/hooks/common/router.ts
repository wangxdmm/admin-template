import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useRouteStore } from ':/store/modules/route'
import type { RouteKey } from ':/types'
import { sys_tools } from ':/global'

export interface RouterPushOptions {
  query?: Record<string, string>
  params?: Record<string, string>
}
/**
 * Router push
 *
 * Jump to the specified route, it can replace function router.push
 *
 * @param inSetup Whether is in vue script setup
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : sys_tools.router
  const route = sys_tools.router.currentRoute

  const routerPush = router.push

  const routerBack = router.back

  async function routerPushByKey(key: RouteKey, options?: RouterPushOptions) {
    const { query, params } = options || {}

    const routeLocation: RouteLocationRaw = {
      name: key,
    }

    if (query) {
      routeLocation.query = query
    }

    if (params) {
      routeLocation.params = params
    }

    return routerPush(routeLocation)
  }

  async function toHome() {
    const routeStore = useRouteStore()
    return routerPushByKey(routeStore.routeHome)
  }

  /**
   * Navigate to login page
   *
   * @param loginModule The login module
   * @param redirectUrl The redirect url, if not specified, it will be the
   *   current route fullPath
   */
  async function toLogin(loginModule?: string, redirectUrl?: string) {
    const module = loginModule || 'pwd-login'

    const options: RouterPushOptions = {
      params: {
        module,
      },
    }

    const redirect = redirectUrl || route.value.fullPath

    options.query = {
      redirect,
    }

    if (!__DEV__) {
      globalThis.location.href = '/web-user'
    }

    return routerPushByKey('login', options)
  }

  /**
   * Toggle login module
   *
   * @param module
   */
  async function toggleLoginModule(module: string) {
    const query = route.value.query as Record<string, string>

    return routerPushByKey('login', { query, params: { module } })
  }

  /** Redirect from login */
  async function redirectFromLogin() {
    const redirect = route.value.query?.redirect as string

    if (redirect) {
      routerPush(redirect)
    }
    else {
      toHome()
    }
  }

  return {
    toHome,
    route,
    routerPush,
    routerBack,
    routerPushByKey,
    toLogin,
    toggleLoginModule,
    redirectFromLogin,
  }
}
