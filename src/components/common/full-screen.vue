<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ButtonIcon from ':/components/custom/button-icon.vue'
import { $t } from ':/locales'

defineOptions({
  name: 'FullScreen',
})

defineProps<Props>()

interface Props {
  full?: boolean
}
</script>

<template>
  <ButtonIcon
    :key="String(full)"
    :tooltip-content="full ? $t('icon.fullscreenExit') : $t('icon.fullscreen')"
  >
    <Icon v-if="full" icon="mingcute:fullscreen-exit-fill" />
    <Icon v-else icon="mingcute:fullscreen-fill" />
  </ButtonIcon>
</template>

<style scoped></style>
