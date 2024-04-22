import { get } from '@monan/shared'
import type { ICodeHandler } from '@monan/easy-axios'
import { sys_store } from '@runafe/easy-admin'

export type CodeHandlerTypes = 'tokenOutdate'

function friendlyGetMes(error: TODO) {
  const mes = get(error, 'response.data', {} as Record<string, unknown>)
  return mes.error_description || mes.errmsg || error.message
}

const notice = function notice(message: string) {
  sys_store.m?.error(message)
}

const handlers: ICodeHandler<CodeHandlerTypes>[] = [
  {
    on: /^5/gi,
    handler: ({ error, back }) => {
      notice(friendlyGetMes(error))
      return back
    },
  },
  {
    id: 'tokenOutdate',
    on: [401],
    handler: async (params) => {
      if (params.dynamicHandler) {
        return params.dynamicHandler(params)
      }

      return params.back
    },
    async: true,
  },
]

export default handlers
