import type { App } from 'vue'
import type { ServerMenu } from './route'

export interface SystemConfig {
  theme: Record<string, any>
  router: TODO
  logo: string
  title: string
  store: {
    getServerRawRoutes: () => Promise<ServerMenu[]>
  }
}

export interface SystemContext {
  app: App
}
