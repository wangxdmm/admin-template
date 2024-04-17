import { locale } from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import { localStg } from ':/utils/storage'
import type { LangType } from ':/types'

/**
 * Set dayjs locale
 *
 * @param lang
 */
export function setDayjsLocale(lang: LangType = 'zh-CN') {
  const localMap = {
    'zh-CN': 'zh-cn',
    'en-US': 'en',
  } satisfies Record<LangType, string>

  const l = lang || localStg.get('lang') || 'zh-CN'

  locale(localMap[l])
}
