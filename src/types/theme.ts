export interface Theme {}

export type ThemeScheme = 'light' | 'dark' | 'auto'

export type ThemeLayoutMode =
  | 'vertical'
  | 'horizontal'
  | 'vertical-mix'
  | 'horizontal-mix'

export type ThemeScrollMode = 'wrapper' | 'content'

export type ColorPaletteNumber =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900

export interface OtherColor {
  info: string
  success: string
  warning: string
  error: string
}

export interface ThemeColor extends OtherColor {
  primary: string
}

export type ThemeColorKey = keyof ThemeColor

export type ThemePaletteColor = {
  [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string
}

interface ThemeTokenColor extends ThemePaletteColor {
  nprogress: string
  container: string
  layout: string
  inverted: string
  base_text: string
  [key: string]: string
}

export type ThemeTabMode = 'button' | 'chrome'

export interface ThemeToken {
  colors: ThemeTokenColor
  boxShadow: {
    header: string
    sider: string
    tab: string
  }
}

export interface ThemeSetting {
  /** Theme scheme */
  themeScheme: ThemeScheme
  /** Theme color */
  themeColor: string
  /** Other color */
  otherColor: OtherColor
  /** Whether info color is followed by the primary color */
  isInfoFollowPrimary: boolean
  /** Layout */
  layout: {
    /** Layout mode */
    mode: ThemeLayoutMode
    /** Scroll mode */
    scrollMode: ThemeScrollMode
  }
  /** Page */
  page: {
    /** Whether to show the page transition */
    animate: boolean
    /** Page animate mode */
    animateMode: string
  }
  /** Header */
  header: {
    /** Header height */
    height: number
    /** Header breadcrumb */
    breadcrumb: {
      /** Whether to show the breadcrumb */
      visible: boolean
      /** Whether to show the breadcrumb icon */
      showIcon: boolean
    }
  }
  /** Tab */
  tab: {
    /** Whether to show the tab */
    visible: boolean
    /**
     * Whether to cache the tab
     *
     * If cache, the tabs will get from the local storage when the page is
     * refreshed
     */
    cache: boolean
    /** Tab height */
    height: number
    /** Tab mode */
    mode: ThemeTabMode
  }
  /** Fixed header and tab */
  fixedHeaderAndTab: boolean
  /** Sider */
  sider: {
    /** Inverted sider */
    inverted: boolean
    /** Sider width */
    width: number
    /** Collapsed sider width */
    collapsedWidth: number
    /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
    mixWidth: number
    /**
     * Collapsed sider width when the layout is 'vertical-mix' or
     * 'horizontal-mix'
     */
    mixCollapsedWidth: number
    /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
    mixChildMenuWidth: number
  }
  /** Footer */
  footer: {
    /** Whether to show the footer */
    visible: boolean
    /** Whether fixed the footer */
    fixed: boolean
    /** Footer height */
    height: number
    /** Whether float the footer to the right when the layout is 'horizontal-mix' */
    right: boolean
  }
}

/** Page animate mode */
export type ThemePageAnimateMode =
  | 'fade'
  | 'fade-slide'
  | 'fade-bottom'
  | 'fade-scale'
  | 'zoom-fade'
  | 'zoom-out'
  | 'none'

export type BaseToken = Record<string, Record<string, string>>

export type LangType = 'en-US' | 'zh-CN'

export type I18nSchema = Record<string, any>

export type I18nKey = string

export interface LangOption {
  label: string
  key: LangType
}

export interface NaiveColorAction {
  scene: NaiveColorScene
  handler: (color: string) => string
}

export type NaiveColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'

export type NaiveColorKey = `${ThemeColorKey}Color${NaiveColorScene}`
