import type { Router } from 'vue-router'

export function createProgressGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    globalThis.NProgress?.start?.()
    next()
  })
  router.afterEach((_to) => {
    globalThis.NProgress?.done?.()
  })
}
