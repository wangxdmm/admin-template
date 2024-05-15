<script setup lang="ts">
import { computed } from 'vue'
import GlobalHeader from '../modules/global-header/index.vue'
import GlobalSider from '../modules/global-sider/index.vue'
import GlobalTab from '../modules/global-tab/index.vue'
import GlobalContent from '../modules/global-content/index.vue'
import GlobalFooter from '../modules/global-footer/index.vue'
import ThemeDrawer from '../modules/theme-drawer/index.vue'
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from ':/materials/src'
import type { LayoutMode } from ':/materials/src'
import { useThemeStore } from ':/store/modules/theme'
import { useAppStore } from ':/store/modules/app'
import type { HeaderProps, ThemeLayoutMode } from ':/types'

defineOptions({
  name: 'BaseLayout',
})

const appStore = useAppStore()
const themeStore = useThemeStore()

const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical'
  const horizontal: LayoutMode = 'horizontal'
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal
})

const headerPropsConfig: Record<ThemeLayoutMode, HeaderProps> = {
  'vertical': {
    showLogo: false,
    showMenu: false,
    showMenuToggler: true,
  },
  'horizontal': {
    showLogo: true,
    showMenu: true,
    showMenuToggler: false,
  },
  'horizontal-mix': {
    showLogo: true,
    showMenu: true,
    showMenuToggler: false,
  },
}

const headerProps = computed(() => headerPropsConfig[themeStore.layout.mode])

const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal')

const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix')

const siderWidth = computed(() => getSiderWidth())

const siderCollapsedWidth = computed(() => getSiderCollapsedWidth())

function getSiderWidth() {
  const { width, mixWidth } = themeStore.sider

  const w = isHorizontalMix.value ? mixWidth : width

  return w
}

function getSiderCollapsedWidth() {
  const { collapsedWidth, mixCollapsedWidth } = themeStore.sider

  const w = isHorizontalMix.value ? mixCollapsedWidth : collapsedWidth

  return w
}
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
  >
    <template #header>
      <GlobalHeader v-bind="headerProps" />
    </template>
    <template #tab>
      <GlobalTab />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <GlobalContent />
    <ThemeDrawer />
    <template #footer>
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style lang="scss">
// TODO
// #__SCROLL_EL_ID__ {
//   @include scrollbar();
// }
</style>
