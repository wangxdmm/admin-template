import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useEventListener, usePreferredColorScheme } from '@vueuse/core'
import {
  addThemeVarsToHtml,
  createThemeToken,
  getNaiveTheme,
  initThemeSettings,
  toggleCssDarkMode,
} from './shared'
import { SetupStoreId } from ':/enum'
import { localStg } from ':/utils'
import type {
  BaseToken,
  ThemeColor,
  ThemeColorKey,
  ThemeLayoutMode,
  ThemeScheme,
  ThemeSetting,
} from ':/types'
import { storeCreatorCreator } from ':/store/share'

let _themeStore: ReturnType<typeof themeStoreCreator>

export const useThemeStore = () => _themeStore()

export const themeStoreCreator = storeCreatorCreator(
  config =>
    defineStore(SetupStoreId.Theme, () => {
      const scope = effectScope()
      const osTheme = usePreferredColorScheme()
      /** Theme settings */
      const settings: Ref<ThemeSetting> = ref(initThemeSettings(config))

      /** Dark mode */
      const darkMode = computed(() => {
        if (settings.value.themeScheme === 'auto') {
          return osTheme.value === 'dark'
        }

        return settings.value.themeScheme === 'dark'
      })

      /** Theme colors */
      const themeColors = computed(() => {
        const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
        const colors: ThemeColor = {
          primary: themeColor,
          ...otherColor,
          info: isInfoFollowPrimary ? themeColor : otherColor.info,
        }
        return colors
      })

      /** Naive theme */
      const naiveTheme = computed(() => {
        const theme = getNaiveTheme(themeColors.value)
        theme.common = {
          ...theme.common,
          heightMedium: '32px',
          heightLarge: '36px',
        }
        return theme
      })

      /**
       * Settings json
       *
       * It is for copy settings
       */
      const settingsJson = computed(() => JSON.stringify(settings.value))

      /** Reset store */
      function resetStore() {
        const themeStore = useThemeStore()

        themeStore.$reset()
      }

      /**
       * Set theme scheme
       *
       * @param themeScheme
       */
      function setThemeScheme(themeScheme: ThemeScheme) {
        settings.value.themeScheme = themeScheme
      }

      /** Toggle theme scheme */
      function toggleThemeScheme() {
        const themeSchemes: ThemeScheme[] = ['light', 'dark', 'auto']

        const index = themeSchemes.findIndex(
          item => item === settings.value.themeScheme,
        )

        const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

        const nextThemeScheme = themeSchemes[nextIndex]

        setThemeScheme(nextThemeScheme)
      }

      /**
       * Update theme colors
       *
       * @param key Theme color key
       * @param color Theme color
       */
      function updateThemeColors(key: ThemeColorKey, color: string) {
        if (key === 'primary') {
          settings.value.themeColor = color
        }
        else {
          settings.value.otherColor[key] = color
        }
      }

      /**
       * Set theme layout
       *
       * @param mode Theme layout mode
       */
      function setThemeLayout(mode: ThemeLayoutMode) {
        settings.value.layout.mode = mode
      }

      /** Setup theme vars to html */
      function setupThemeVarsToHtml() {
        const { themeTokens, darkThemeTokens } = createThemeToken(
          themeColors.value,
        )

        addThemeVarsToHtml(
          themeTokens as unknown as BaseToken,
          darkThemeTokens as unknown as BaseToken,
        )
      }

      /** Cache theme settings */
      function cacheThemeSettings() {
        const isProd = import.meta.env.PROD

        if (!isProd) {
          return
        }

        localStg.set('themeSettings', settings.value)
      }

      // cache theme settings when page is closed or refreshed
      useEventListener(window, 'beforeunload', () => {
        cacheThemeSettings()
      })

      // watch store
      scope.run(() => {
        // watch dark mode
        watch(
          darkMode,
          (val) => {
            toggleCssDarkMode(val)
          },
          { immediate: true },
        )

        // themeColors change, update css vars and storage theme color
        watch(
          themeColors,
          (val) => {
            setupThemeVarsToHtml()

            localStg.set('themeColor', val.primary)
          },
          { immediate: true },
        )
      })

      /** On scope dispose */
      onScopeDispose(() => {
        scope.stop()
      })

      return {
        ...toRefs(settings.value),
        darkMode,
        themeColors,
        naiveTheme,
        settingsJson,
        resetStore,
        setThemeScheme,
        toggleThemeScheme,
        updateThemeColors,
        setThemeLayout,
      }
    }),
  (store) => {
    _themeStore = store
  },
)

export type UseThemeStore = typeof useThemeStore
