import { defineSystem } from '../'
import { setupRouter } from './router'
import 'uno.css'
import './styles/scss/theme/index.scss'
import './plugins/assets'

const sys = defineSystem(() => ({
  logo: '',
  setting: {},
  title: 'cbb设计器开发平台',
  router: {
    getServerRawRoutes: () => Promise.resolve([]),
  },
  auth: {
    login: async () => ({
      access_token: '11',
      refresh_token: '22',
    }),
  },
  envs: {
    PRO: false,
  },
  initSystem: async () => {},
}))

;(async () => {
  await setupRouter(sys.app)
  sys.app.mount('#app')
})()
