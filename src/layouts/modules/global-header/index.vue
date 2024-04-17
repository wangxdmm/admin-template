<script setup lang="ts">
import { computed } from 'vue'
import { useFullscreen } from '@vueuse/core'
import HorizontalMenu from '../global-menu/base-menu.vue'
import GlobalLogo from '../global-logo/index.vue'
import GlobalBreadcrumb from '../global-breadcrumb/index.vue'
import { useMixMenuContext } from '../../hooks/use-mix-menu'
import ThemeButton from './components/theme-button.vue'
import UserAvatar from './components/user-avatar.vue'

import { useRouteStore } from ':/store/modules/route'
import { useThemeStore } from ':/store/modules/theme'
import { useAppStore } from ':/store/modules/app'
import type { HeaderProps } from ':/types'

defineOptions({
  name: 'GlobalHeader',
})

defineProps<Props>()

interface Props {
  /** Whether to show the logo */
  showLogo?: HeaderProps['showLogo']
  /** Whether to show the menu toggler */
  // showMenuToggler?: App.Global.HeaderProps['showMenuToggler']
  /** Whether to show the menu */
  showMenu?: HeaderProps['showMenu']
}

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { isFullscreen, toggle } = useFullscreen()
const { menus } = useMixMenuContext()

const headerMenus = computed(() => {
  if (themeStore.layout.mode === 'horizontal') {
    return routeStore.menus
  }

  if (themeStore.layout.mode === 'horizontal-mix') {
    return menus.value
  }

  return []
})
</script>

<template>
  <DarkModeContainer
    class="h-full flex-y-center b-b border-#f4f4f4 dark:border-none"
  >
    <GlobalLogo
      v-if="showLogo"
      class="h-full"
      :style="{ width: `${themeStore.sider.width}px` }"
    />
    <HorizontalMenu
      v-if="showMenu"
      mode="horizontal"
      :menus="headerMenus"
      class="px-16px"
    />
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-16px" />
    </div>
    <div class="mr-16px h-full flex-y-center  gap-16px justify-end">
      <div class="flex-c_c  gap-16px">
        <FullScreen
          v-if="!appStore.isMobile"
          :full="isFullscreen"
          @click="toggle"
        />
        <!-- <LangSwitch :lang="appStore.locale" :lang-options="appStore.localeOptions" @change-lang="appStore.changeLocale" /> -->
        <ThemeSchemaSwitch
          :theme-schema="themeStore.themeScheme"
          :is-dark="themeStore.darkMode"
          @switch="themeStore.toggleThemeScheme"
        />
        <ThemeButton />
      </div>
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
