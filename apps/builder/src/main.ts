import { defineSystem, getToken } from '@runafe/easy-admin'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'
import type { LoginParam } from '@runafe/unified-model'
import { createRoutes, getAuthVueRoutes, router, setupRouter } from './router'
import formKitConfig from './formkit.config'
import { routeMap } from './router/elegant/transform'
import { userLogin, userNormal } from './api'
import http from './http'
import Logo from './assets/logo.png'
import 'uno.css'
import '@runafe/easy-admin/style'
import '@runafe/magic-system/style'

const sys = defineSystem(() => ({
  logo: Logo,
  formKitConfig,
  setting: {},
  http,
  title: 'CBB开发平台',
  router: {
    map: routeMap,
    getAuthVueRoutes,
    createRoutes,
    instance: router,
    getServerRawRoutes: () =>
      Promise.resolve([
        {
          meta: {
            id: '1',
            title: '表格',
          },
        },
        {
          meta: {
            id: '2',
            title: '列表',
          },
        },
        {
          meta: {
            id: '3',
            title: '设计器',
          },
        },
      ]),
  },
  auth: {
    login: async (param) => {
      const { backData } = await userLogin.login(param as LoginParam)()
      return backData!
    },
  },
  hooks: {
    onSystemInit: async () => {
      const { backData } = await userNormal.loginUserInfo()()
      if (backData) {
        sys.authStore()?.setUserInfo(backData as TODO)
        return true
      }
      return false
    },
  },
  envs: {
    PROD: false,
  },
  initSystem: async () => {},
}))

;(async () => {
  http.registerDynamicRequestConfig('token', (config) => {
    // TODO compatible to 4.0 cookie
    const token = getToken()
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`
    }
    return config
  })

  http.config.salt = () => {
    const path = router.currentRoute.value.path
    return path
  }

  http.registerDynamicHandler('tokenOutdate', () => {
    sys.authStore().resetStore()
  })

  sys.app.use(Particles, {
    init: async engine => await loadSlim(engine),
  })
  await setupRouter(sys.app)
  sys.app.mount('#app')
})()
