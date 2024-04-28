import process from 'node:process'
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
      const constantRoutes = ['login', '403', '404', '500', 'entry', 'test']
      const data = rolesMap[envs.VITE_APP_CODE][routeName]

      // 非一级
      if (!data && !constantRoutes.includes(key)) {
        console.error(`\n\nPlease add current route id of "${routeName}"\n\n`)
        process.exit(1)
      }

      const meta: Partial<RouteMeta> = {
        title: key,
      }

      if (data?.id) {
        meta.roles = [data.id]
        meta.id = data.id
        if (data.icon) {
          meta.icon = data.icon
        }
      }

      if (constantRoutes.includes(key)) {
        meta.constant = true
      }

      return meta
    },
  })
}
