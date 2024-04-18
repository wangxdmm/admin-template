import { defineSystem } from '@runafe/easy-admin'
import { router, setupRouter } from './router'
import { createRoutes, getAuthVueRoutes } from './router/routes'
import { routeMap } from './router/elegant/transform'
import 'uno.css'
import '@runafe/easy-admin/styles/css/global.css'
import '@runafe/easy-admin/dist/style.css'

const sys = defineSystem(() => ({
  logo: '',
  formKitConfig: {},
  setting: {},
  title: 'cbb设计器开发平台',
  router: {
    map: routeMap,
    getAuthVueRoutes,
    createRoutes,
    instance: router,
    getServerRawRoutes: () =>
      Promise.resolve([
        {
          meta: {
            id: '5201',
          },
        },
      ]),
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
