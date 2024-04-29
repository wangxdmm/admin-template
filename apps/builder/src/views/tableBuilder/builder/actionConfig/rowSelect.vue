<script lang="tsx" setup>
import type { ActionConfig } from '@runafe/unified-api-designer'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { titleClass } from '../share'
import { tableSchema } from '../tableSchema'

const rowSelect = computed<ActionConfig['rowSelect']>({
  get: () => tableSchema.value.actionConfig?.rowSelect || {},
  set: (val) => {
    tableSchema.value.actionConfig!.rowSelect = val
  },
})

const schema: FormKitSchemaDefinition = [
  {
    $el: 'p',
    children: '行选择功能',
    attrs: {
      class: '$titleClass',
    },
  },
  {
    $formkit: 'n:switch',
    name: 'enabled',
    id: 'rowEnabled',
    label: '是否启用',
  },
  {
    $formkit: 'n:number',
    name: 'pagerCount',
    label: '最大选择数量',
    if: '$get(rowEnabled).value',
    showButton: false,
    min: 0,
  },

]

const data = {
  titleClass,
}
</script>

<template>
  <div>
    <FormKit v-model="rowSelect" type="form" :actions="false" :incomplete-message="false">
      <FormKitSchema :schema :data />
    </FormKit>
  </div>
</template>
../useTableSchema