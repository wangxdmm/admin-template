<script setup lang="ts">
import { computed } from 'vue'
import GlobalLogo from '../global-logo/index.vue'
import VerticalMenu from '../global-menu/base-menu.vue'
import HorizontalMixMenu from '../global-menu/horizontal-mix-menu.vue'
import { useRouteStore } from ':/store/modules/route'
import { useThemeStore } from ':/store/modules/theme'
import { useAppStore } from ':/store/modules/app'
import MenuToggler from ':/components/common/menu-toggler.vue'

defineOptions({
  name: 'GlobalSider',
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()

const isHorizontalMix = computed(
  () => themeStore.layout.mode === 'horizontal-mix',
)
const darkMenu = computed(
  () =>
    !themeStore.darkMode && !isHorizontalMix.value && themeStore.sider.inverted,
)
const showLogo = computed(() => !isHorizontalMix.value)
</script>

<template>
  <DarkModeContainer
    class="relative size-full flex-vertical-stretch shadow-sider"
    :inverted="darkMenu"
  >
    <GlobalLogo
      v-if="showLogo"
      :dark-menu="darkMenu"
      :show-title="!appStore.siderCollapse"
      :style="{ height: `${themeStore.header.height}px` }"
    />
    <HorizontalMixMenu v-if="isHorizontalMix" />
    <VerticalMenu v-else :dark-theme="darkMenu" :menus="routeStore.menus" />
    <MenuToggler
      :dark-menu="darkMenu"
      :collapsed="appStore.siderCollapse"
      @click="appStore.toggleSiderCollapse"
    />
  </DarkModeContainer>
</template>

<style scoped></style>
