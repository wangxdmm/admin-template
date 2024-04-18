import { useDialog } from '@runafe/magic-system'
import type { useLoadingBar, useMessage, useNotification } from 'naive-ui'
import type { InjectionKey } from 'vue'
import type { Router } from 'vue-router'
import type { SystemConfig } from './types'

export interface AppGlobalTools {
  m: ReturnType<typeof useMessage>
  l: ReturnType<typeof useLoadingBar>
  n: ReturnType<typeof useNotification>
  d: ReturnType<typeof useDialog>
  router: Router
}

export const sys_tools = new Proxy(
  {},
  {
    get(_, attr) {
      switch (attr) {
        case 'm':
          return window.$message
        case 'l':
          return window.$loadingBar
        case 'n':
          return window.$notification
        case 'd':
          return useDialog()
        case 'router':
          return window.$router
      }
    },
  },
) as AppGlobalTools

export const systemSymbol = Symbol('system') as InjectionKey<{
  config: SystemConfig
}>

export function useSystemConfig() {
  return inject(systemSymbol)
}
