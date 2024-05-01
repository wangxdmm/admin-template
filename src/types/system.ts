import type { Router } from 'vue-router'
import type { AtLeast } from '@monan/types'
import type { Restful } from '@monan/easy-axios'
import type { ElegantConstRoute, ServerMenu } from './route'
import type { ThemeSetting } from './theme'
import type { UserLoginParam } from './user'

export interface SystemConfig {
  formKitConfig: TODO
  theme?: ThemeSetting
  home?: string
  http?: Restful<any>
  setting: TODO
  router: {
    hideInMenuRoutes?: string[]
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
    initSystem?: () => Promise<any> | undefined | void
    afterLogOut?: () => any
    // init system info, you can set all infomations in this hooks
    onSystemInit?: () => Promise<boolean> | boolean | undefined | void
  }
}

export interface SystemContext {}

export interface LoginBackData {
  access_token: string
  refresh_token: string
}
