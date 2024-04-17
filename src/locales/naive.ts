import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import type { NDateLocale, NLocale } from 'naive-ui'
import type { LangType } from ':/types'

export const naiveLocales: Record<LangType, NLocale> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const naiveDateLocales: Record<LangType, NDateLocale> = {
  'zh-CN': dateZhCN,
  'en-US': dateEnUS,
}
