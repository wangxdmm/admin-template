import { useDialog } from '@runafe/magic-system'
import type { useLoadingBar, useMessage, useNotification } from 'naive-ui'

export interface AppGlobalTools {
  m: ReturnType<typeof useMessage>
  l: ReturnType<typeof useLoadingBar>
  n: ReturnType<typeof useNotification>
  d: ReturnType<typeof useDialog>
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
      }
    },
  },
) as AppGlobalTools
