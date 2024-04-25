<script lang="tsx" setup>
import type { ActionConfig } from '@runafe/unified-api-designer'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { titleClass } from '../share'

const rowSelect = ref<ActionConfig['treeTable']>({})

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
    options: 'fields',
  },
  {
    $formkit: 'n:select',
    name: 'parentField',
    label: '父级关联字段',
    if: '$get(treeTableEnabled).value',
    validation: 'required',
    options: 'fields',
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
