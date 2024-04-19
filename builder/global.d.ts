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
}

export {}
