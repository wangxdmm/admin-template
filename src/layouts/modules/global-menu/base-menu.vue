<script setup lang="ts">
import { type VNodeChild, computed, h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { MentionOption, MenuProps } from 'naive-ui'
import { SimpleScrollbar } from ':/materials/src'
import { useAppStore } from ':/store/modules/app'
import { useThemeStore } from ':/store/modules/theme'
import { useRouteStore } from ':/store/modules/route'
import { useRouterPush } from ':/hooks'
import type { Menu, RouteKey } from ':/types'

defineOptions({
  name: 'BaseMenu',
})

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
})

interface Props {
  darkTheme?: boolean
  mode?: MenuProps['mode']
  menus: Menu[]
}

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKey } = useRouterPush()
const naiveMenus = computed(() => {
  const menus = props.menus as unknown as MentionOption[]
  return menus
})
const isHorizontal = computed(() => props.mode === 'horizontal')
const siderCollapse = computed(
  () => themeStore.layout.mode === 'vertical' && appStore.siderCollapse,
)
const headerHeight = computed(() => `${themeStore.header.height}px`)
const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  const routeName = (hideInMenu ? activeMenu : name) || name

  return routeName
})
const expandedKeys = ref<string[]>([])

function updateExpandedKeys() {
  if (isHorizontal.value || siderCollapse.value || !selectedKey.value) {
    expandedKeys.value = []
    return
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value)
}

function handleClickMenu(key: RouteKey) {
  routerPushByKey(key)
}

function renderLabel(options: MentionOption): VNodeChild {
  if (options.icon) {
    return options.label as string
  }
  else {
    return [
      h('span', {
        class: 'mr-12px',
      }),
      options.label as string,
    ]
  }
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  { immediate: true },
)
</script>

<template>
  <SimpleScrollbar>
    <NMenu
      v-model:expanded-keys="expandedKeys"
      :theme-overrides="{
        itemHeight: '38px',
      }"
      :mode="mode"
      :value="selectedKey"
      :collapsed="siderCollapse"
      :collapsed-width="themeStore.sider.collapsedWidth"
      :collapsed-icon-size="22"
      :options="naiveMenus"
      :inverted="darkTheme"
      :indent="18"
      :render-label="renderLabel"
      responsive
      @update:value="handleClickMenu"
    />
  </SimpleScrollbar>
</template>

<style scoped>
:deep(.n-menu--horizontal) {
  --n-item-height: v-bind(headerHeight) !important;
}
</style>
