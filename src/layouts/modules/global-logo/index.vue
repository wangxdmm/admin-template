<script setup lang="ts">
import { useSystemConfig } from ':/global'

defineOptions({
  name: 'GlobalLogo',
})

withDefaults(defineProps<Props>(), {
  showTitle: true,
})

interface Props {
  /** Whether to show the title */
  showTitle?: boolean
  darkMenu?: boolean
}

const systemConfig = useSystemConfig()
</script>

<template>
  <div class="w-full nowrap-hidden flex-s_c_nw">
    <SystemLogo :class="showTitle ? 'ml-18px' : 'ml-20px'" />
    <h2
      v-show="showTitle"
      :class="{
        'text-#fff': darkMenu,
      }"
      class=":uno: w-116px pl-10px text-16px transition duration-300 ease-in-out dark:text-#fff"
    >
      {{ systemConfig?.config.title }}
    </h2>
    <!-- <SvgIcon v-if="showTitle" class="ml-10px mt-3px cursor-pointer text-20px text-#fff" icon="fe:app-menu" /> -->
  </div>
</template>

<style scoped></style>
