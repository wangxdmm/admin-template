import type { Router } from 'vue-router'
import type { AtLeast } from '@monan/types'
import type { ElegantConstRoute, ServerMenu } from './route'
import type { ThemeSetting } from './theme'

export interface SystemConfig {
  formKitConfig: TODO
  theme?: ThemeSetting
  setting: TODO
  router: {
    instance: Router
    getServerRawRoutes: () => Promise<AtLeast<ServerMenu, 'meta'>[]>
    createRoutes: () => any
    getAuthVueRoutes: (routes: ElegantConstRoute[]) => any
    map: Record<string, string>
  }
  logo: string
  title: string
  auth: {
    login: () => Promise<LoginBackData>
  }
  initSystem: () => Promise<any>
  envs?: Record<string, any>
}

export interface SystemContext {}

export interface LoginBackData {
  access_token: string
  refresh_token: string
}
