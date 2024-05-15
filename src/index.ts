import { createApp, h } from 'vue'
import { plugin as fkPlugin } from '@formkit/vue'
import ms from '@runafe/magic-system'
import { merge } from 'merge-anything'
import type { SystemConfig } from './types'
import AppView from './App.vue'
import { setupLoading, setupNProgress } from './plugins'
import { setupI18n } from './locales'
import SvgIcon from './components/custom/svg-icon.vue'
import DarkModeContainer from './components/common/dark-mode-container.vue'
import ExceptionBase from './components/common/exception-base.vue'
import ButtonIcon from './components/custom/button-icon.vue'
import { hooks } from './global'
import { setupStore } from ':/store'
import ':/styles/index.css'

export function DEFAULT_SYS_CONFIG_GETTER() {
  return {
    global: {
      title: 'Admin',
      home: 'entry',
    },
    envs: {
      PROD: false,
      VITE_ICON_LOCAL_PREFIX: 'local-icon',
      VITE_MENU_ICON: 'mdi:menu',
    },
  }
}

export function defineSystem(userConfig: (context: any) => SystemConfig) {
  const config = userConfig({})

  globalThis.__Easy_Admin_Config__ = merge(
    {},
    DEFAULT_SYS_CONFIG_GETTER(),
    config,
  )

  hooks.callHook('router', config.router)

  // setup
  const app = createApp(
    h(AppView, {
      config,
    }),
  )

  const stores = setupStore(app, config)

  // init Plugins
  setupLoading()
  setupNProgress()
  setupI18n(app)

  app.use(fkPlugin, config.formkitOptions).use(ms)
  app.component('SvgIcon', SvgIcon)
  app.component('DarkModeContainer', DarkModeContainer)
  app.component('ExceptionBase', ExceptionBase)
  app.component('ButtonIcon', ButtonIcon)

  hooks.callHook('app', app)

  return {
    app,
    stores,
  }
}

export * from './global'
export * from './guard'
export * from './transform'
export * from ':/store/modules/auth/shared'
export * from './store'
export * from './types'
export * from './hooks'

export { default as layouts } from './layouts'
