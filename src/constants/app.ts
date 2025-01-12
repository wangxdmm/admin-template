import type {
  I18nKey,
  ThemeLayoutMode,
  ThemeScheme,
  ThemeScrollMode,
  ThemeTabMode,
} from ':/types'
import { transformRecordToOption } from ':/utils'

export const themeSchemaRecord: Record<ThemeScheme, I18nKey> = {
  light: 'theme.themeSchema.light',
  dark: 'theme.themeSchema.dark',
  auto: 'theme.themeSchema.auto',
}

export const themeSchemaOptions = transformRecordToOption(themeSchemaRecord)

export const themeLayoutModeRecord: Record<ThemeLayoutMode, I18nKey> = {
  'vertical': 'theme.layoutMode.vertical',
  'horizontal': 'theme.layoutMode.horizontal',
  'horizontal-mix': 'theme.layoutMode.horizontal-mix',
}

export const themeLayoutModeOptions = transformRecordToOption(
  themeLayoutModeRecord,
)

export const themeScrollModeRecord: Record<ThemeScrollMode, I18nKey> = {
  wrapper: 'theme.scrollMode.wrapper',
  content: 'theme.scrollMode.content',
}

export const themeScrollModeOptions = transformRecordToOption(
  themeScrollModeRecord,
)

export const themeTabModeRecord: Record<ThemeTabMode, I18nKey> = {
  chrome: 'theme.tab.mode.chrome',
  button: 'theme.tab.mode.button',
}

export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord)

// export const themePageAnimationModeRecord: Record<
//   ThemePageAnimateMode,
//   I18nKey
// > = {
//   'fade-slide': 'theme.page.mode.fade-slide',
//   'fade': 'theme.page.mode.fade',
//   'fade-bottom': 'theme.page.mode.fade-bottom',
//   'fade-scale': 'theme.page.mode.fade-scale',
//   'zoom-fade': 'theme.page.mode.zoom-fade',
//   'zoom-out': 'theme.page.mode.zoom-out',
//   'none': 'theme.page.mode.none',
// }

// export const themePageAnimationModeOptions = transformRecordToOption(
//   themePageAnimationModeRecord,
// )
