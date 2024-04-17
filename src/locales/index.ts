import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from './locale'
import { localStg } from ':/utils/storage'
import type { I18nSchema, LangType } from ':/types'

const i18n = createI18n<I18nSchema, LangType, false>({
  locale: localStg.get('lang') || 'zh-CN',
  fallbackLocale: 'en',
  messages: messages as TODO,
  legacy: false,
})
/**
 * Setup plugin i18n
 *
 * @param app
 */
export function setupI18n(app: App) {
  app.use(i18n)
}

export const $t = i18n.global.t

export function setLocale(locale: LangType) {
  i18n.global.locale.value = locale
}
