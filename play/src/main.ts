import { defineSystem } from '@runafe/easy-admin'
import { router, setupRouter } from './router'
import { createRoutes, getAuthVueRoutes } from './router/routes'
import 'uno.css'
import '@runafe/easy-admin/styles/css/global.css'

const sys = defineSystem(() => ({
  logo: '',
  formKitConfig: {},
  setting: {},
  title: 'cbb设计器开发平台',
  router: {
    getAuthVueRoutes,
    createRoutes,
    instance: router,
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
