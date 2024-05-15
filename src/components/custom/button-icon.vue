<script setup lang="ts">
import { computed } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import type { PopoverPlacement } from 'naive-ui'

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  class: 'text-icon',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
})

interface Props {
  /** Button class */
  class?: string
  /** Iconify icon name */
  icon?: string
  /** Tooltip content */
  tooltipContent?: string
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement
  /** ContentClass */
  contentClass?: string[]
}

interface ButtonProps {
  className: string
}

const [DefineButton, Button] = createReusableTemplate<ButtonProps>()

const cls = computed(() => {
  let clsStr = props.class

  if (!clsStr.includes('text-')) {
    clsStr += ' text-icon'
  }

  return clsStr
})

const contentClass = computed(() => {
  const cls = ['flex-center']

  if (props.contentClass?.length) {
    cls.push(...props.contentClass)
  }

  return cls
})
</script>

<template>
  <!-- define component: Button -->
  <DefineButton v-slot="{ $slots, className }">
    <NButton
      quaternary :class="className" :theme-overrides="{
        paddingMedium: '0 4px',
        heightMedium: '26px',
      }"
    >
      <div :class="contentClass">
        <component :is="$slots.default" />
      </div>
    </NButton>
  </DefineButton>

  <!-- template -->
  <NTooltip v-if="tooltipContent" :placement="tooltipPlacement" :z-index="98">
    <template #trigger>
      <Button :class-name="cls" v-bind="$attrs">
        <slot>
          <SvgIcon :icon="icon" />
        </slot>
      </Button>
    </template>
    {{ tooltipContent }}
  </NTooltip>
  <Button v-else :class-name="cls" v-bind="$attrs">
    <slot>
      <SvgIcon :icon="icon" />
    </slot>
  </Button>
</template>

<style scoped></style>
