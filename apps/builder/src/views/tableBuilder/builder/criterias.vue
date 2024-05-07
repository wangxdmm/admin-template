<script lang='ts' setup>
import { criteriasFields } from './options'
import { useCriterias } from ':/components/criterias'

const props = defineProps<{
  config: any
  label: string
}>()

const criterias = useCriterias(criteriasFields, props.config)

function create() {
  criterias.use()
}
</script>

<template>
  <div>
    <p class="m-b-10px">
      {{ props.label || '条件表达式' }}
    </p>
    <n-button class="w-full bg-light m-b-24px" @click="create">
      <template #icon>
        <SvgIcon icon="ri:settings-line" class="inline-block align-text-bottom text-14px" />
      </template>
    </n-button>
  </div>
</template>
