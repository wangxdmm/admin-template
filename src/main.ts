import { createApp } from 'vue'
import './plugins/assets'
import { plugin } from '@formkit/vue'
import ms from '@runafe/magic-system'
import '@runafe/magic-system/style'

import { setupIconifyOffline, setupLoading, setupNProgress } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupI18n } from './locales'

import App from './App.vue'
import fkConfig from './formkit.config'
import './styles/scss/theme/index.scss'

async function setupApp() {
  setupLoading()
  setupNProgress()
  setupIconifyOffline()

  const app = createApp(App)

  setupStore(app)
  setupI18n(app)
  await setupRouter(app)

  app.use(plugin, fkConfig).use(ms)

  app.mount('#app')
}

setupApp()
