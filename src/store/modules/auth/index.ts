import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { isArray } from 'xe-utils'
import { useRouteStore } from '../route'
import { clearAuthStorage, getToken, getUserInfo } from './shared'
import { useLoading } from ':/global-hooks/src'
import { SetupStoreId } from ':/enum'
import { useRouterPush } from ':/hooks/common/router'
import { localStg } from ':/utils/storage'
import { $t } from ':/locales'
import { storeCreatorCreator } from ':/store/share'

let _useAuthStore: ReturnType<typeof authStoreCreator>

export const useAuthStore = () => _useAuthStore()

export const authStoreCreator = storeCreatorCreator(
  config =>
    defineStore(SetupStoreId.Auth, () => {
      const routeStore = useRouteStore()
      const { route, toLogin, redirectFromLogin } = useRouterPush(false)
      const { loading: loginLoading, startLoading, endLoading } = useLoading()
      const token = ref(getToken())
      const userInfo: TODO = reactive(getUserInfo())
      /** Is login */
      const isLogin = computed(() => Boolean(token.value))
      const systemPerm = ref<string[]>([])
      /** Reset auth store */
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
        userInfo.roles = roles
        localStg.set('userInfo', userInfo)
      }

      function updateGlobalRules(rules: TODO) {
        localStg.set('globalRules', rules)
      }

      async function login(_param: TODO) {
        startLoading()

        const authInfo = await config.auth.login()

        if (authInfo) {
          const pass = await loginByToken({
            token: authInfo.access_token,
            refreshToken: authInfo.refresh_token,
          })

          if (pass) {
            await routeStore.initAuthRoute()

            await redirectFromLogin()

            if (routeStore.isInitAuthRoute) {
              sys_tools.n?.success({
                title: $t('page.login.common.loginSuccess'),
                content: $t('page.login.common.welcomeBack', {
                  userName: userInfo.realName,
                }),
                duration: 4500,
              })
            }
          }
        }
        else {
          resetStore()
        }

        endLoading()
      }

      async function initSystem() {
        return true
      }

      async function loginByToken(loginToken: TODO) {
        // 1. stored in the localStorage, the later requests need it in headers
        localStg.set('token', loginToken.token)
        localStg.set('refreshToken', loginToken.refreshToken)

        token.value = loginToken.token

        return await initSystem()
      }

      return {
        initSystem,
        updateUserRoles,
        updateGlobalRules,
        token,
        userInfo,
        isLogin,
        loginLoading,
        resetStore,
        login,
        systemPerm,
        has: (s: string | string[]) => {
          if (isArray(s)) {
            return s.every(p => systemPerm.value.includes(p))
          }

          return systemPerm.value.includes(s)
        },
      }
    }),
  (store) => {
    _useAuthStore = store
  },
)
