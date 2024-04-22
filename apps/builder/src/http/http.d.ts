import type { MessageOptions as NMessageOption } from 'naive-ui'

declare module '@monan/easy-axios' {
  export interface ServerDefinedResponse<T = unknown, S = boolean> {
    code?: number
    resultCode: number
    data?: T
    message?: string
    success?: S
    total?: number
    exception?: string
  }

  export interface MessageOptions extends NMessageOption {}
}

export {}
