import type { App } from 'vue'
import {
  type RouterHistory,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { createRouterGuard } from '@runafe/easy-admin'
import { createRoutes } from './routes'

type RouterHistoryMode = 'hash' | 'history' | 'memory'

const historyCreatorMap: Record<
  RouterHistoryMode,
  (base?: string) => RouterHistory
> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}

const { constantVueRoutes } = createRoutes()

export const router = createRouter({
  history: historyCreatorMap.hash('/'),
  routes: constantVueRoutes,
})

/** Setup Vue Router */
export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}

export * from './routes'
