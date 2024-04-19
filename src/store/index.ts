import type { App } from 'vue'
import { createPinia } from 'pinia'
import { resetSetupStore } from './plugins'

import type { UseAuthStore } from ':/store/modules/auth'
import type { UseAppStore } from ':/store/modules/app'
import type { UseRouteStore } from ':/store/modules/route'
import type { UseTabStore } from ':/store/modules/tab'
import type { UseThemeStore } from ':/store/modules/theme'

/** Setup Vue store plugin pinia */
export function setupStore(app: App) {
  const store = createPinia()

  store.use(resetSetupStore)

  app.use(store)
}

export interface SystemStores {
  auth: UseAuthStore
  app: UseAppStore
  route: UseRouteStore
  tab: UseTabStore
  theme: UseThemeStore
}
