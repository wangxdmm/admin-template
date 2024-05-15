import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { isArray } from '@monan/shared'
import { useRouteStore } from '../route'
import { clearAuthStorage, getToken } from './shared'
import { useRouterPush } from ':/hooks'
import { SetupStoreId } from ':/enum'
import { localStg } from ':/utils'

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const routeStore = useRouteStore()
  const { route, toLogin } = useRouterPush()
  const token = ref<string>(getToken())
  const isLogin = computed(() => Boolean(token.value))
  const systemPerm = ref<string[]>([])
  const userRoles = ref<string[]>([])

  async function resetStore(forceToLogin?: boolean) {
    const authStore = useAuthStore()

    clearAuthStorage()

    authStore.$reset()

    if (!route.value.meta.constant) {
      await toLogin()
    }

    routeStore.resetStore()

    if (forceToLogin) {
      await toLogin()
    }
  }

  function updateUserRoles(roles: string[]) {
    userRoles.value = roles
    localStg.set('userRoles', roles)
  }

  function setToken(t: string) {
    token.value = t
    localStg.set('token', t)
  }

  return {
    updateUserRoles,
    token,
    isLogin,
    setToken,
    userRoles,
    resetStore,
    systemPerm,
    has: (s: string | string[]) => {
      if (isArray(s)) {
        return s.every(p => systemPerm.value.includes(p))
      }

      return systemPerm.value.includes(s)
    },
  }
})
