import type { Router } from 'vue-router'
import type { AtLeast } from '@monan/types'
import type { ElegantConstRoute, ServerMenu } from './route'
import type { ThemeSetting } from './theme'
import type { UserLoginParam } from './user'

export interface SystemConfig {
  formKitConfig: TODO
  theme?: ThemeSetting
  home?: string
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
    login: (params: UserLoginParam) => Promise<LoginBackData>
  }
  envs?: {
    PROD?: boolean
    VITE_ICON_LOCAL_PREFIX?: string
    VITE_MENU_ICON?: string
  }
  hooks?: {
    initSystem?: () => Promise<any>
    afterLogOut?: () => any
    // init system info, you can set all infomations in this hooks
    onSystemInit?: () => Promise<boolean>
  }
}

export interface SystemContext {}

export interface LoginBackData {
  access_token: string
  refresh_token: string
}
