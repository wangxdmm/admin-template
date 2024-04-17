<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { match } from 'pinyin-pro'
import { defineSystemConfig } from '@runafe/magic-system'
import { useAppStore } from './store/modules/app'
import { useThemeStore } from './store/modules/theme'
import { naiveDateLocales, naiveLocales } from './locales/naive'

defineOptions({
  name: 'App',
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const naiveDarkTheme = computed(() =>
  themeStore.darkMode ? darkTheme : undefined,
)
const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale]
})
const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale]
})

const config = defineSystemConfig({})
</script>

<template>
  <NConfigProvider
    abstract
    inline-theme-disabled
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    :component-options="{
      Select: {
        filter: (pattern, _, meta) => {
          return (
            meta?.label
            && match(meta?.label, pattern, {
              continuous: true,
              precision: 'start',
            })
          )
        },
      },
    }"
  >
    <AppProvider>
      <RsProvider :config>
        <RouterView class="bg-layout" />
      </RsProvider>
    </AppProvider>
  </NConfigProvider>
</template>
