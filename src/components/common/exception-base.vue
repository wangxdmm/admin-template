<script lang="ts" setup>
import { computed } from 'vue'
import { $t } from ':/locales'
import { useRouterPush } from ':/hooks/common/router'

defineOptions({ name: 'ExceptionBase' })

const props = defineProps<Props>()
const push = useRouterPush()
type ExceptionType = '403' | '404' | '500'

interface Props {
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType
}

const iconMap: Record<ExceptionType, string> = {
  403: 'no-permission',
  404: 'not-found',
  500: 'service-error',
}

const icon = computed(() => iconMap[props.type])

function toHome() {
  push.toHome()
}
</script>

<template>
  <div
    class="size-full min-h-520px flex-vertical-center gap-24px overflow-hidden"
  >
    <div class="flex text-400px text-primary">
      <SvgIcon :local-icon="icon" />
    </div>
    <NButton type="primary" @click="toHome">
      {{ $t('common.backToHome') }}
    </NButton>
  </div>
</template>

<style scoped></style>
