import type { App } from 'vue'
import { createPinia } from 'pinia'
import type { SystemConfig } from '..'
import { resetSetupStore } from './plugins'

export function setupStore(app: App, _config: SystemConfig) {
  const store = createPinia()

  store.use(resetSetupStore)

  app.use(store)
}

export * from './modules/app'
export * from './modules/auth'
export * from './modules/route'
export * from './modules/tab'
export * from './modules/theme'
