/** Default theme settings */
// --color-primary: #4194fc;
// --color-white: #ffffff;
// --color-black: #000000;
// --color-success: #3bbc8d;
// --color-warning: #ffb25f;
import type { ThemeSetting } from ':/types'

// --color-danger: #f25858;
export const themeSettings: ThemeSetting = {
  themeScheme: 'light',
  themeColor: '#165DFF',
  otherColor: {
    info: '#ffb25f',
    success: '#3bbc8d',
    warning: '#faad14',
    error: '#f25858',
  },
  isInfoFollowPrimary: true,
  layout: {
    mode: 'vertical',
    scrollMode: 'content',
  },
  page: {
    animate: false,
    animateMode: 'fade-slide',
  },
  header: {
    height: 56,
    breadcrumb: {
      visible: true,
      showIcon: false,
    },
  },
  tab: {
    visible: false,
    cache: true,
    height: 33,
    mode: 'button',
  },
  fixedHeaderAndTab: true,
  sider: {
    inverted: true,
    width: 200,
    collapsedWidth: 64,
    mixWidth: 90,
    mixCollapsedWidth: 64,
    mixChildMenuWidth: 200,
  },
  footer: {
    visible: false,
    fixed: false,
    height: 48,
    right: true,
  },
}

/**
 * Override theme settings
 *
 * If publish new version, use `overrideThemeSettings` to override certain theme
 * settings
 */
export const overrideThemeSettings: Partial<ThemeSetting> = {}
