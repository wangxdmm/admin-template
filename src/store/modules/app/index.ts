import { effectScope, onScopeDispose, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { breakpointsTailwind, useBreakpoints, useTitle } from '@vueuse/core'
import { useRouteStore } from '../route'
import { useTabStore } from '../tab'
import { useThemeStore } from '../theme'
import { useBoolean } from ':/hooks'
import { SetupStoreId } from ':/enum'
import { $t, setLocale } from ':/locales'
import { localStg } from ':/utils'
import type { LangOption, LangType } from ':/types'
import { storeCreatorCreator } from ':/store/share'

let _useAppStore: ReturnType<typeof appStoreCreator>

export const appStoreCreator = storeCreatorCreator(
  config =>
    defineStore(SetupStoreId.App, () => {
      const themeStore = useThemeStore()
      const routeStore = useRouteStore()
      const tabStore = useTabStore()
      const scope = effectScope()
      const breakpoints = useBreakpoints(breakpointsTailwind)
      const {
        bool: themeDrawerVisible,
        setTrue: openThemeDrawer,
        setFalse: closeThemeDrawer,
      } = useBoolean()
      const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true)
      const { bool: fullContent, toggle: toggleFullContent } = useBoolean()
      const { bool: contentXScrollable, setBool: setContentXScrollable }
        = useBoolean()
      const {
        bool: siderCollapse,
        setBool: setSiderCollapse,
        toggle: toggleSiderCollapse,
      } = useBoolean()

      /** Is mobile layout */
      const isMobile = breakpoints.smaller('sm')

      async function reloadPage(duration = 0) {
        setReloadFlag(false)

        if (duration > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, duration)
          })
        }

        setReloadFlag(true)
      }

      const locale = ref<LangType>(localStg.get('lang') || 'zh-CN')

      const localeOptions: LangOption[] = [
        {
          label: '中文',
          key: 'zh-CN',
        },
        {
          label: 'English',
          key: 'en-US',
        },
      ]

      function changeLocale(lang: LangType) {
        locale.value = lang
        setLocale(lang)
        localStg.set('lang', lang)
      }

      /** Update document title by locale */
      function updateDocumentTitleByLocale() {
        const { i18nKey, title }
          = config.router.instance.currentRoute.value.meta

        const documentTitle = i18nKey ? $t(i18nKey) : title

        useTitle(documentTitle)
      }

      // watch store
      scope.run(() => {
        // watch isMobile, if is mobile, collapse sider
        watch(
          isMobile,
          (newValue) => {
            if (newValue) {
              setSiderCollapse(true)

              themeStore.setThemeLayout('vertical')
            }
          },
          { immediate: true },
        )

        // watch locale
        watch(locale, () => {
          // update document title by locale
          updateDocumentTitleByLocale()

          // update global menus by locale
          routeStore.updateGlobalMenusByLocale()

          // update tabs by locale
          tabStore.updateTabsByLocale()
        })
      })

      /** On scope dispose */
      onScopeDispose(() => {
        scope.stop()
      })

      return {
        isMobile,
        reloadFlag,
        reloadPage,
        fullContent,
        locale,
        localeOptions,
        changeLocale,
        themeDrawerVisible,
        openThemeDrawer,
        closeThemeDrawer,
        toggleFullContent,
        contentXScrollable,
        setContentXScrollable,
        siderCollapse,
        setSiderCollapse,
        toggleSiderCollapse,
      }
    }),
  (store) => {
    _useAppStore = store
  },
)

export const useAppStore = () => _useAppStore()

export type UseAppStore = typeof useAppStore
