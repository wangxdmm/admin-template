import axios from 'axios'
import qs from 'qs'
import { get, isObject, isString } from '@monan/shared'
import type { MessageOptions, ServerDefinedResponse } from '@monan/easy-axios'
import {
  ContentTypeEnum,
  ContentTypeKey,
  defineEasyAxios,
} from '@monan/easy-axios'
import { sys_store } from '@runafe/easy-admin'
import codeHandler, { type CodeHandlerTypes } from './codeHandler'

export const errroFlag = 'isSysError'

const instance = axios.create({
  baseURL: '/v4.0',
  timeout: 60000,
  transformRequest: [
    (data, headers) => {
      switch (headers![ContentTypeKey]) {
        case ContentTypeEnum.JSON: {
          return JSON.stringify(data)
        }
        case ContentTypeEnum.FORM: {
          return qs.stringify(data, { arrayFormat: 'repeat' })
        }
      }
      return data
    },
  ],
})

export function showErrorMessageTip(
  messageOrOptions?: string | Partial<MessageOptions>,
) {
  if (!messageOrOptions) {
    return
  }

  sys_store.m?.destroyAll()

  if (isString(messageOrOptions)) {
    sys_store.m?.error(messageOrOptions)
  }
  else if (isObject(messageOrOptions) && messageOrOptions.message) {
    sys_store.m?.error(messageOrOptions.message, messageOrOptions)
  }
}

export function showSuccessMessageTip(
  messageOrOptions?: string | Partial<MessageOptions>,
) {
  if (!messageOrOptions) {
    return
  }
  sys_store.m?.destroyAll()
  if (isString(messageOrOptions)) {
    sys_store.m?.success(messageOrOptions)
  }
  else if (isObject(messageOrOptions) && messageOrOptions.message) {
    sys_store.m?.success(messageOrOptions.message, messageOrOptions)
  }
}

const { http, isSysError } = defineEasyAxios<CodeHandlerTypes>({
  single: true,
  errorFlag: errroFlag,
  instance,
  codeHandler,
  transIns(instance) {
    instance.defaults.headers[ContentTypeKey] = ContentTypeEnum.JSON
  },
})

http.createDefaultStrategies<ServerDefinedResponse>((ins) => {
  return {
    showErrorMessageTip,
    showSuccessMessageTip,
    isSuccess: res =>
      !!res?.data
      && (res.data.resultCode === 0
      || !!(res.config.responseType === 'blob' && res.data)
      || res.data.success === true),
    getBackData: ({ res }) => {
      if (isSysError(res)) {
        return res
      }
      else {
        if (res.config.responseType === 'blob') {
          return res.data
        }

        return res.data.data
      }
    },
    getMessage: ({ res }) => {
      if (ins.isSysError(res)) {
        const message = get(
          res,
          'error.response.data.message',
          res.error.message,
        )

        if (res.error?.code === 'ERR_CANCELED') {
          return ''
        }

        return message
      }
      return res.data.message || res.data.exception?.slice(0, 200)
    },
  }
})

// handler params
http.registerDynamicRequestConfig('paramsSerializer', (config) => {
  config.paramsSerializer = {
    serialize(params) {
      return qs.stringify(params, { indices: false })
    },
  }
  return config
})

export default http
