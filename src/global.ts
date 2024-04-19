import { useDialog } from '@runafe/magic-system'
import type { useLoadingBar, useMessage, useNotification } from 'naive-ui'
import { type InjectionKey, type Ref, inject } from 'vue'
import type { Router } from 'vue-router'
import type { SystemConfig } from './types'
import type { SystemStores } from './store/'

export interface AppGlobalTools {
  m: ReturnType<typeof useMessage>
  l: ReturnType<typeof useLoadingBar>
  n: ReturnType<typeof useNotification>
  d: ReturnType<typeof useDialog>
  router: Router
  config: Ref<SystemConfig>
  stores: SystemStores
}

export const sys_store = new Proxy(
  {},
  {
    get(_, attr) {
      switch (attr) {
        case 'm':
          return globalThis.$message
        case 'l':
          return globalThis.$loadingBar
        case 'n':
          return globalThis.$notification
        case 'd':
          return useDialog()
        case 'router':
          return globalThis.$router
        case 'config':
          return globalThis.__Easy_Admin_Config__
        case 'stores':
          return globalThis.__Easy_Admin_Modules__
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
