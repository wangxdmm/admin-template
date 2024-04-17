<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({ name: 'MenuToggler' })

const props = defineProps<Props>()

interface Props {
  /** Show collapsed icon */
  collapsed?: boolean
  /** Arrow style icon */
  arrowIcon?: boolean
  darkMenu?: boolean
}

type NumberBool = 0 | 1

const icon = computed(() => {
  const icons: Record<NumberBool, Record<NumberBool, string>> = {
    0: {
      0: 'line-md:menu-fold-left',
      1: 'line-md:menu-fold-right',
    },
    1: {
      0: 'ph-caret-double-left-bold',
      1: 'ph-caret-double-right-bold',
    },
  }
  const arrowIcon = Number(props.arrowIcon || false) as NumberBool
  const collapsed = Number(props.collapsed || false) as NumberBool

  return icons[arrowIcon][collapsed]
})

const cls = computed(() => {
  return {
    'cursor-pointer absolute bottom-10px right-24px z-100 text-18px text-#fff':
      true,
    'text-gray': !props.darkMenu,
  }
})
</script>

<template>
  <RsIcon :icon="icon" :size="20" :class="cls" />
</template>

<style scoped></style>
