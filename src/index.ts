import { createApp, h, ref } from 'vue'
import { plugin as fkPlugin } from '@formkit/vue'
import ms from '@runafe/magic-system'
import { merge } from 'merge-anything'
import type { SystemConfig, SystemContext } from './types'
import AppView from './App.vue'
import { setupIconifyOffline, setupLoading, setupNProgress } from './plugins'
import { setupStore } from './store'
import { setupI18n } from './locales'
import SvgIcon from './components/custom/svg-icon.vue'
import DarkModeContainer from './components/common/dark-mode-container.vue'
import ExceptionBase from './components/common/exception-base.vue'
import ':/styles/css/index.css'
import {
  appStoreCreator,
  authStoreCreator,
  routeStoreCreator,
  tabStoreCreator,
  themeStoreCreator,
} from ':/store/creator'

export function DEFAULT_SYS_CONFIG_GETTER() {
  return {
    title: 'Admin',
    envs: {
      PROD: false,
      VITE_ICON_LOCAL_PREFIX: 'local-icon',
      VITE_MENU_ICON: 'mdi:menu',
    },
    home: 'entry',
  }
}

export function defineSystem(
  userConfig: (context: SystemContext) => SystemConfig,
) {
  const config = userConfig({})

  globalThis.__Easy_Admin_Config__ = ref(
    merge({}, DEFAULT_SYS_CONFIG_GETTER(), config),
  )
  globalThis.$router = config.router.instance
  globalThis.routeMap = config.router.map

  // setup
  const app = createApp(
    h(AppView, {
      config,
    }),
  )
  setupStore(app)

  // add some global components
  app.component('SvgIcon', SvgIcon)
  app.component('DarkModeContainer', DarkModeContainer)
  app.component('ExceptionBase', ExceptionBase)

  // init Store
  const appStore = appStoreCreator(config)
  const authStore = authStoreCreator(config)
  const routeStore = routeStoreCreator(config)
  const tabStore = tabStoreCreator(config)
  const themeStore = themeStoreCreator(config)

  globalThis.__Easy_Admin_Modules__ = {
    app: appStore,
    auth: authStore,
    route: routeStore,
    tab: tabStore,
    theme: themeStore,
  }

  // init Plugins
  setupLoading()
  setupNProgress()
  setupIconifyOffline()
  setupI18n(app)

  app.use(fkPlugin, config.formKitConfig).use(ms)

  return {
    app,
    appStore,
    authStore,
    routeStore,
    tabStore,
    themeStore,
  }
}

export { default as BaseLayout } from './layouts/base-layout/index.vue'
export { default as BlankLayout } from './layouts/blank-layout/index.vue'
export * from './global'
export * from './guard'
export * from './transform'
export * from ':/store/modules/auth/shared'
