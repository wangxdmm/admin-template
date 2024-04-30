<script lang="tsx" setup>
import type { ActionConfig } from '@runafe/unified-api-designer'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { titleClass } from '../share'
import { tableColumns, tableSchema } from '../tableSchema'
import { viewModelFields } from '../viewModels'

const treeTable = computed<ActionConfig['treeTable']>({
  get: () => tableSchema.value.actionConfig?.treeTable || {},
  set: (val) => {
    tableSchema.value.actionConfig!.treeTable = val
  },
})

const schema: FormKitSchemaDefinition = [
  {
    $el: 'p',
    children: '树表格配置',
    attrs: {
      class: '$titleClass',
    },
  },
  {
    $formkit: 'n:switch',
    name: 'treeTableEnabled',
    id: 'treeTableEnabled',
    label: '是否启用',
  },
  {
    $formkit: 'n:select',
    name: 'nodeField',
    label: '节点字段',
    if: '$get(treeTableEnabled).value',
    validation: 'required',
    options: '$tableColumns',
    labelField: 'label',
    valueField: 'name',
  },
  {
    $formkit: 'n:select',
    name: 'parentField',
    label: '父级关联字段',
    if: '$get(treeTableEnabled).value',
    validation: 'required',
    options: '$viewModelFields',
    labelField: 'label',
    valueField: 'name',
  },

]

const data = {
  titleClass,
  tableColumns,
  viewModelFields,
}
</script>

<template>
  <div>
    <FormKit v-model="treeTable" type="form" :actions="false" :incomplete-message="false">
      <FormKitSchema :schema :data />
    </FormKit>
  </div>
</template>
