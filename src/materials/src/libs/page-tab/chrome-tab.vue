<script setup lang="ts">
import type { PageTabProps } from '../../types'
import ChromeTabBg from './chrome-tab-bg.vue'
import style from './index.module.css'

defineOptions({
  name: 'ChromeTab',
})

const props = defineProps<PageTabProps>()

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
    class=":uno: group relative h-33px inline-flex cursor-pointer items-center justify-center justify-center gap-16px whitespace-nowrap px-24px -mr-18px first-of-type:(pl-10px)"
    :class="[
      style['chrome-tab'],
      { [style['chrome-tab_dark']]: darkMode },
      { [style['chrome-tab_active']]: active },
      { [style['chrome-tab_active_dark']]: active && darkMode },
    ]"
  >
    <div class=":uno: pointer-events-none absolute left-0 top-0 h-full w-full -z-1" :class="[style['chrome-tab__bg']]">
      <ChromeTabBg />
    </div>
    <div
      class=":uno: soy-tab-block inline-flex items-center justify-center gap-16px whitespace-nowrap px-6px py-2px text-12px dark:group-hover:bg-dark-950"
      :class="{
        'group-hover:(bg-primary-100 rd-6px transition)': !active,
      }"
    >
      <slot name="prefix" />
      <slot />
      <slot name="suffix" />
    </div>
    <div
      v-show="!props.hideDivider" class=":uno: absolute right-6px h-12px w-2px bg-gray-400"
      :class="[style['chrome-tab-divider']]"
    />
  </div>
</template>

<style scoped></style>
