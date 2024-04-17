<script setup lang="ts">
import type { Component } from 'vue'
import { useAppStore } from ':/store/modules/app'
import { useRouteStore } from ':/store/modules/route'

defineOptions({
  name: 'GlobalContent',
})

withDefaults(defineProps<Props>(), {
  showPadding: false,
})

interface Props {
  /** Show padding for content */
  showPadding?: boolean
}

const appStore = useAppStore()
// const themeStore = useThemeStore()
const routeStore = useRouteStore()

// TODO add http clearCache
function loadComponent(c: Component) {
  return c
}
</script>

<template>
  <RouterView v-slot="ctx">
    <!-- <Transition
      :name="themeStore.page.animateMode"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-enter="appStore.setContentXScrollable(false)"
      > -->
    <KeepAlive :include="routeStore.cacheRoutes">
      <component
        :is="loadComponent(ctx.Component)"
        v-if="appStore.reloadFlag"
        :key="ctx.route.path"
      />
    </KeepAlive>
    <!-- </Transition> -->
  </RouterView>
</template>

<style></style>
