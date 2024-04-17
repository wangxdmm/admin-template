<script setup lang="ts">
import type { PageTabProps } from '../../types'
import style from './index.module.css'

defineOptions({
  name: 'ButtonTab',
})

defineProps<PageTabProps>()

defineSlots<Slots>()

type SlotFn = (props?: Record<string, unknown>) => any

interface Slots {
  /**
   * Slot
   *
   * The center content of the tab
   */
  default?: SlotFn
  /**
   * Slot
   *
   * The left content of the tab
   */
  prefix?: SlotFn
  /**
   * Slot
   *
   * The right content of the tab
   */
  suffix?: SlotFn
}
</script>

<template>
  <div
    class=":uno: relative inline-flex cursor-pointer items-center justify-center gap-4px whitespace-nowrap rounded-2px bg-#f2f3f5 px-8px py-3px text-12px text-#4e5969 dark:bg-zinc-800"
    :class="[
      style['button-tab'],
      { [style['button-tab_dark']]: darkMode },
      { [style['button-tab_active']]: active },
      { [style['button-tab_active_dark']]: active && darkMode },
    ]"
  >
    <!-- <slot name="prefix" /> -->
    <slot />
    <slot name="suffix" />
  </div>
</template>

<style scoped></style>
