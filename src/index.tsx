import { createApp } from 'vue'
import { plugin as fkPlugin } from '@formkit/vue'
import ms from '@runafe/magic-system'
import type { SystemConfig, SystemContext } from './types'
import AppView from './App.vue'
import { setupIconifyOffline, setupLoading, setupNProgress } from './plugins'
import { setupStore } from './store'
import { setupI18n } from './locales'
import fkConfig from './formkit.config'
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
  // setup
  const app = createApp(<AppView config={config}></AppView>)
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

  app.use(fkPlugin, fkConfig).use(ms)

  return {
    app,
    appStore,
    authStore,
    routeStore,
    tabStore,
    themeStore,
  }
}
