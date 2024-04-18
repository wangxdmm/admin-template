import { createApp } from 'vue'
import { plugin as fkPlugin } from '@formkit/vue'
import ms from '@runafe/magic-system'
import type { SystemConfig, SystemContext } from './types'
import AppView from './App.vue'
import { setupIconifyOffline, setupLoading, setupNProgress } from './plugins'
import { setupStore } from './store'
import { setupI18n } from './locales'
import {
  appStoreCreator,
  authStoreCreator,
  routeStoreCreator,
  tabStoreCreator,
  themeStoreCreator,
} from ':/store/creator'

export function defineSystem(
  userConfig: (context: SystemContext) => SystemConfig,
) {
  const config = userConfig({})
  window.$router = config.router.instance
  // setup
  const app = createApp(
    h(AppView, {
      config,
    }),
  )
  setupStore(app)
  // init Store
  const appStore = appStoreCreator(config)
  const authStore = authStoreCreator(config)
  const routeStore = routeStoreCreator(config)
  const tabStore = tabStoreCreator(config)
  const themeStore = themeStoreCreator(config)

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
