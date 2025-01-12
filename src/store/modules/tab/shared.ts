import type { Router } from 'vue-router'
import { $t } from ':/locales'
import type { Tab, TabRoute } from ':/types'
import { APP_INST } from ':/global'

function getRoutePath(name: string) {
  return APP_INST.config?.transform.getRoutePath(name)
}

/**
 * Get all tabs
 *
 * @param tabs Tabs
 * @param homeTab Home tab
 */
export function getAllTabs(tabs: Tab[], homeTab?: Tab) {
  if (!homeTab) {
    return []
  }

  const filterHomeTabs = tabs.filter(tab => tab.id !== homeTab.id)

  const fixedTabs = filterHomeTabs
    .filter(tab => tab.fixedIndex !== undefined)
    .sort((a, b) => a.fixedIndex! - b.fixedIndex!)

  const remainTabs = filterHomeTabs.filter(
    tab => tab.fixedIndex === undefined,
  )

  const allTabs = [...fixedTabs, ...remainTabs]

  return updateTabsLabel(allTabs)
}

/**
 * Get tab id by route
 *
 * @param route
 */
export function getTabIdByRoute(route: TabRoute) {
  const { path, query = {}, meta } = route

  let id = path

  if (meta.multiTab) {
    const queryKeys = Object.keys(query).sort()
    const qs = queryKeys.map(key => `${key}=${query[key]}`).join('&')

    id = `${path}?${qs}`
  }

  return id
}

/**
 * Get tab by route
 *
 * @param route
 */
export function getTabByRoute(route: TabRoute) {
  const { name, path, fullPath = path, meta } = route

  const { title, i18nKey, fixedIndexInTab } = meta

  // Get icon and localIcon from getRouteIcons function
  const { icon, localIcon } = getRouteIcons(route)

  const label = i18nKey ? $t(i18nKey) : title

  const tab: Tab = {
    id: getTabIdByRoute(route),
    label,
    routeKey: name as string,
    routePath: path,
    fullPath,
    fixedIndex: fixedIndexInTab,
    icon,
    localIcon,
    i18nKey,
  }

  return tab
}

/**
 * The vue router will automatically merge the metas of all matched items, and
 * the icons here may be affected by other matching items, so they need to be
 * processed separately
 *
 * @param route
 */
export function getRouteIcons(route: TabRoute) {
  // Set default value for icon at the beginning
  let icon: string
    = route?.meta?.icon || APP_INST.config.envs?.VITE_MENU_ICON || ''
  let localIcon: string | undefined = route?.meta?.localIcon

  // Route.matched only appears when there are multiple matches,so check if route.matched exists
  if (route.matched) {
    // Find the meta of the current route from matched
    const currentRoute = route.matched.find(r => r.name === route.name)
    // If icon exists in currentRoute.meta, it will overwrite the default value
    icon = currentRoute?.meta?.icon || icon
    localIcon = currentRoute?.meta?.localIcon
  }

  return { icon, localIcon }
}

/**
 * Get default home tab
 *
 * @param router
 * @param homeRouteName RouteHome in useRouteStore
 */
export function getDefaultHomeTab(router: Router, homeRouteName: string) {
  const homeRoutePath = getRoutePath(homeRouteName)

  let homeTab: Tab = {
    id: getRoutePath(homeRouteName),
    label: homeRouteName,
    routeKey: homeRouteName,
    routePath: homeRoutePath,
    fullPath: homeRoutePath,
  }

  const routes = router.getRoutes()
  const homeRoute = routes.find(route => route.name === homeRouteName)
  if (homeRoute) {
    homeTab = getTabByRoute(homeRoute)
  }

  return homeTab
}

/**
 * Is tab in tabs
 *
 * @param tabId
 * @param tabs
 */
export function isTabInTabs(tabId: string, tabs: Tab[]) {
  return tabs.some(tab => tab.id === tabId)
}

/**
 * Filter tabs by id
 *
 * @param tabId
 * @param tabs
 */
export function filterTabsById(tabId: string, tabs: Tab[]) {
  return tabs.filter(tab => tab.id !== tabId)
}

/**
 * Filter tabs by ids
 *
 * @param tabIds
 * @param tabs
 */
export function filterTabsByIds(tabIds: string[], tabs: Tab[]) {
  return tabs.filter(tab => !tabIds.includes(tab.id))
}

/**
 * Extract tabs by all routes
 *
 * @param router
 * @param tabs
 */
export function extractTabsByAllRoutes(router: Router, tabs: Tab[]) {
  const routes = router.getRoutes()

  const routeNames = routes.map(route => route.name)

  return tabs.filter(tab => routeNames.includes(tab.routeKey))
}

/**
 * Get fixed tabs
 *
 * @param tabs
 */
export function getFixedTabs(tabs: Tab[]) {
  return tabs.filter(tab => tab.fixedIndex !== undefined)
}

/**
 * Get fixed tab ids
 *
 * @param tabs
 */
export function getFixedTabIds(tabs: Tab[]) {
  const fixedTabs = getFixedTabs(tabs)

  return fixedTabs.map(tab => tab.id)
}

/**
 * Update tabs label
 *
 * @param tabs
 */
function updateTabsLabel(tabs: Tab[]) {
  const updated = tabs.map(tab => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label,
  }))

  return updated
}

/**
 * Update tab by i18n key
 *
 * @param tab
 */
export function updateTabByI18nKey(tab: Tab) {
  const { i18nKey, label } = tab

  return {
    ...tab,
    label: i18nKey ? $t(i18nKey) : label,
  }
}

/**
 * Update tabs by i18n key
 *
 * @param tabs
 */
export function updateTabsByI18nKey(tabs: Tab[]) {
  return tabs.map(tab => updateTabByI18nKey(tab))
}

/**
 * Find tab by route name
 *
 * @param name
 * @param tabs
 */
export function findTabByRouteName(name: string, tabs: Tab[]) {
  const routePath = getRoutePath(name)

  const tabId = routePath
  const multiTabId = `${routePath}?`

  return tabs.find(tab => tab.id === tabId || tab.id.startsWith(multiTabId))
}
