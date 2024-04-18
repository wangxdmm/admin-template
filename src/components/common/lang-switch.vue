<script setup lang="ts">
import { computed } from 'vue'
import ButtonIcon from ':/components/custom/button-icon.vue'
import { $t } from ':/locales'
import type { LangOption, LangType } from ':/types'

defineOptions({
  name: 'LangSwitch',
})

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
})

const emit = defineEmits<Emits>()

interface Props {
  /** Current language */
  lang: LangType
  /** Language options */
  langOptions: LangOption[]
  /** Show tooltip */
  showTooltip?: boolean
}

interface Emits {
  (e: 'changeLang', lang: LangType): void
}

const tooltipContent = computed(() => {
  if (!props.showTooltip) {
    return ''
  }

  return $t('icon.lang')
})

function changeLang(lang: LangType) {
  emit('changeLang', lang)
}
</script>

<template>
  <NDropdown
    :value="lang"
    :options="langOptions as TODO"
    trigger="hover"
    @select="changeLang"
  >
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="heroicons:language" />
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
