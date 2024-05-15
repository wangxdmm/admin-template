import { useDialog } from '@runafe/magic-system'
import type { useLoadingBar, useMessage, useNotification } from 'naive-ui'
import type { App, InjectionKey } from 'vue'
import type { Router } from 'vue-router'
import { createHooks } from 'hookable'
import type { SystemConfig } from './types'

// eslint-disable-next-line import/no-mutable-exports
export let router: Router

export const hooks = createHooks<{
  beforeInit: () => any
  app: (app: App) => any
  router: (router: Router) => any
}>()

hooks.hook('router', (r) => {
  router = r
})

export interface AppGlobalTools {
  m: ReturnType<typeof useMessage>
  l: ReturnType<typeof useLoadingBar>
  n: ReturnType<typeof useNotification>
  d: ReturnType<typeof useDialog>
  router: Router
  config: SystemConfig
  hooks: typeof hooks
}

export const APP_INST = new Proxy(
  {},
  {
    get(_, attr) {
      switch (attr) {
        case 'hooks':
          return hooks
        case 'm':
          return globalThis.$message
        case 'l':
          return globalThis.$loadingBar
        case 'n':
          return globalThis.$notification
        case 'd':
          return useDialog()
        case 'router':
          return router
        case 'config':
          return globalThis.__Easy_Admin_Config__
      }
    },
  },
) as AppGlobalTools

export const systemSymbol = Symbol('system') as InjectionKey<{
  config: SystemConfig
}>

export function useSystemConfig() {
  return globalThis.__Easy_Admin_Config__
}
