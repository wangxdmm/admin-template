<script setup lang="ts">
import DarkMode from './modules/dark-mode.vue'

// import LayoutMode from './modules/layout-mode.vue'
import ThemeColor from './modules/theme-color.vue'
import PageFun from './modules/page-fun.vue'
import ConfigOperation from './modules/config-operation.vue'
import { $t } from ':/locales'
import { useAppStore } from ':/store/modules/app'

defineOptions({
  name: 'ThemeDrawer',
})

const appStore = useAppStore()

// TODO wait for vue
// https://github.com/vuejs/core/issues/10709
// [Vue warn] Set operation on key "_ctx" failed: target is readonly
</script>

<template>
  <NDrawer
    v-model:show="appStore.themeDrawerVisible"
    display-directive="show"
    :width="360"
  >
    <NDrawerContent
      :title="$t('theme.themeDrawerTitle')"
      :native-scrollbar="false"
      closable
    >
      <DarkMode />
      <!-- <LayoutMode /> -->
      <ThemeColor />
      <PageFun />
      <template #footer>
        <ConfigOperation />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
