import type { RouteMeta } from 'vue-router'
import ElegantVueRouter from '@runafe/elegant-router-vue/vite'
import rolesMap from './rolesMap'

export function setupElegantRouter(envs: Env.ImportMeta) {
  return ElegantVueRouter({
    alias: {
      ':': 'src',
    },
    layouts: {
      base: 'src/layouts/base',
      blank: 'src/layouts/blank',
    },
    customRoutes: {
      names: ['exception_403', 'exception_404', 'exception_500'],
    },
    getRouteLayout: (name) => {
      if (['403', '404', '500', 'login'].includes(name)) {
        return 'blank'
      }
      return null
    },
    routePathTransformer(routeName, routePath) {
      const key = routeName as string

      if (key === 'login') {
        const modules: string[] = [
          'pwd-login',
          'code-login',
          'register',
          'reset-pwd',
          'bind-wechat',
        ]

        const moduleReg = modules.join('|')

        return `/login/:module(${moduleReg})?`
      }

      return routePath
    },
    onRouteMetaGen(routeName) {
      const key = routeName
      const constantRoutes = ['login', '403', '404', '500', 'entry']
      const roleMeta = rolesMap[envs.VITE_APP_CODE][routeName]
      const isConstRoute = constantRoutes.includes(key)
      const isHidenRoute = !roleMeta && !isConstRoute

      if (isHidenRoute) {
        console.warn(`\n\nHidenRoute [${routeName}] detected!! \n\n`)
      }

      const meta: Partial<RouteMeta> = {
        title: key,
      }

      if (roleMeta?.id) {
        meta.roles = [roleMeta.id]
        meta.id = roleMeta.id
        if (roleMeta.icon) {
          meta.icon = roleMeta.icon
        }
      }

      if (isConstRoute) {
        meta.constant = true
      }

      if (isHidenRoute) {
        meta.hideInMenu = true
        meta.roles = [routeName]
      }

      return meta
    },
  })
}
