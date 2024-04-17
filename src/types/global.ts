import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type RouteKey = string

export type RouteMap = Record<string, string>

export type RoutePath = string

export type LastLevelRouteKey = string

/** The global header props */
export interface HeaderProps {
  /** Whether to show the logo */
  showLogo?: boolean
  /** Whether to show the menu toggler */
  showMenuToggler?: boolean
  /** Whether to show the menu */
  showMenu?: boolean
}

/** The global menu */
export interface Menu {
  /**
   * The menu key
   *
   * Equal to the route key
   */
  key: string
  /** The menu label */
  label: string
  /** The menu i18n key */
  i18nKey?: string
  /** The route key */
  routeKey: RouteKey
  /** The route path */
  routePath: RoutePath
  /** The menu icon */
  icon?: () => VNode
  /** The menu children */
  children?: Menu[]
}

export type Breadcrumb = Omit<Menu, 'children'> & {
  options?: Breadcrumb[]
}

/** Tab route */
export type TabRoute = Pick<
  RouteLocationNormalizedLoaded,
  'name' | 'path' | 'meta'
> &
Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>

/** The global tab */
export interface Tab {
  /** The tab id */
  id: string
  /** The tab label */
  label: string
  /**
   * The new tab label
   *
   * If set, the tab label will be replaced by this value
   */
  newLabel?: string
  /**
   * The old tab label
   *
   * When reset the tab label, the tab label will be replaced by this value
   */
  oldLabel?: string
  /** The tab route key */
  routeKey: LastLevelRouteKey
  /** The tab route path */
  routePath: RouteMap[LastLevelRouteKey]
  /** The tab route full path */
  fullPath: string
  /** The tab fixed index */
  fixedIndex?: number
  /**
   * Tab icon
   *
   * Iconify icon
   */
  icon?: string
  /**
   * Tab local icon
   *
   * Local icon
   */
  localIcon?: string
  /** I18n key */
  i18nKey?: string
}

/** The global dropdown key */
export type DropdownKey =
  | 'closeCurrent'
  | 'closeOther'
  | 'closeLeft'
  | 'closeRight'
  | 'closeAll'
