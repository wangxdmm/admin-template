import zhCN from './langs/zh-cn'
import enUS from './langs/en-us'
import type { I18nSchema, LangType } from ':/types'

const locales: Record<LangType, I18nSchema> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export default locales
