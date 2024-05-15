import type { Tab } from './common'
import type { LangType, ThemeSetting } from './theme'
import type { UserInfo } from './user'

export interface Session {
  /** The theme color */
  themeColor: string
  // /**
  //  * the theme settings
  //  */
  // themeSettings: App.Theme.ThemeSetting;
}

export interface Local {
  /** The i18n language */
  lang: LangType
  /** The token */
  token: string
  /** The refresh token */
  refreshToken: string
  /** The user info */
  // TODO
  userInfo: UserInfo
  userRoles: string[]
  /** The theme color */
  themeColor: string
  /** The theme settings */
  themeSettings: ThemeSetting
  /**
   * The override theme flags
   *
   * The value is the build time of the project
   */
  overrideThemeFlag: string
  /** The global tabs */
  globalTabs: Tab[]
}
