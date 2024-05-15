import type { RouteComponent, Router } from 'vue-router'
import type { FormKitOptions } from '@formkit/core'
import type { VNodeTypes } from 'vue'
import type { MaybeGetter, SystemProviderOptions } from '@runafe/magic-system'
import type { transformCreator } from '../transform'
import type { ServerMenu } from './route'

export interface SystemConfig {
  global: {
    /** Global system logo */
    logo: MaybeGetter<VNodeTypes>
    /** Title will display in index.html */
    title: string
    /** Default is 'entry' */
    home?: string
    /** Menus will be load but can not show in sider menu */
    hiddenMenus?: string[]
    /** Global views map like: {login: import(xxx)} */
    viewsMap: Record<string, RouteComponent | (() => Promise<RouteComponent>)>
    /** Name to path map */
    routeMap: Record<string, string>
    /** Get serverMenus */
    serverMenusGetter: () => Promise<ServerMenu[]>
  }
  /** System provider options in @runaf/magic-system */
  systemProviderOptions: Partial<SystemProviderOptions>
  /**
   * This is an global transform function, it will be called by route and global
   * auth
   */
  transform: ReturnType<typeof transformCreator>
  /** Vue-router instance */
  router: Router
  /**
   * Formkit config
   *
   * See: https://formkit.com/getting-started/installation
   */
  formkitOptions?: FormKitOptions
  /** Some Envs for soybean admin, Maybe remove later! */
  envs?: {
    PROD?: boolean
    VITE_ICON_LOCAL_PREFIX?: string
    VITE_MENU_ICON?: string
  }
}
