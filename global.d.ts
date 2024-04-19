/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import type { NProgress } from 'nprogress'
import type {
  DialogProviderInst,
  LoadingBarProviderInst,
  MessageProviderInst,
  NotificationProviderInst,
} from 'naive-ui'
import type { Router } from 'vue-router'
import type { SystemConfig } from ':/types'
import type { SystemStores } from ':/store/share'

declare global {
  var NProgress: NProgress
  var $loadingBar: LoadingBarProviderInst
  var $dialog: DialogProviderInst
  var $message: MessageProviderInst
  var $notification: NotificationProviderInst
  var $router: Router
  var routeMap: Record<string, string>
  var __Easy_Admin_Config__: Ref<SystemConfig>
  var __Easy_Admin_Modules__: SystemStores
}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Title of the route
     *
     * It can be used in document title
     */
    title: string
    /**
     * I18n key of the route
     *
     * It's used in i18n, if it is set, the title will be ignored
     */
    i18nKey?: string
    /**
     * Roles of the route
     *
     * Route can be accessed if the current user has at least one of the roles
     */
    roles?: string[]
    /** Whether to cache the route */
    keepAlive?: boolean
    /**
     * Is constant route
     *
     * Does not need to login, and the route is defined in the front-end
     */
    constant?: boolean
    /**
     * Iconify icon
     *
     * It can be used in the menu or breadcrumb
     */
    icon?: string
    /**
     * Local icon
     *
     * In "src/assets/svg-icon", if it is set, the icon will be ignored
     */
    localIcon?: string
    /** Router order */
    order?: number
    /** The outer link of the route */
    href?: string
    /** Whether to hide the route in the menu */
    hideInMenu?: boolean
    /**
     * The menu key will be activated when entering the route
     *
     * The route is not in the menu
     *
     * @example
     *   the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
     */
    activeMenu?: string
    /**
     * By default, the same route path will use one tab, if set to true, it will
     * use multiple tabs
     */
    multiTab?: boolean
    /**
     * If set, the route will be fixed in tabs, and the value is the order of
     * fixed tabs
     */
    fixedIndexInTab?: number
  }
}

export {}
