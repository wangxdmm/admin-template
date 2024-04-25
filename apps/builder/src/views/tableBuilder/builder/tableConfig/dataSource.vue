<script lang="tsx" setup>
import type { DataSource } from '@runafe/unified-api-designer'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { titleClass } from '../share'
import { viewModels } from '../useData'

const dataSource = ref<DataSource>({
  viewModelCode: 'adept-settlement',
  serverName: 'string',
  filter: 'string',
  loadOnInit: true,
  primaryKeyFieldName: 'string',
})

const schema: FormKitSchemaDefinition = [
  {
    $el: 'p',
    children: '数据源',
    attrs: {
      class: titleClass,
    },
  },
  {
    $formkit: 'n:select',
    name: 'viewModelCode',
    label: '视图',
    validation: 'required',
    options: '$viewModels',
    valueField: 'code',
    labelField: 'name',
  },
  {
    $formkit: 'n:text',
    name: 'primaryKeyFieldName',
    label: '视图唯一标识字段',
  },
  {
    $formkit: 'n:text',
    name: 'serverName',
    label: '服务名',
    disabled: true,
  },
  {
    $formkit: 'n:text',
    name: 'filter',
    label: '数据范围',
  },
  {
    $formkit: 'n:switch',
    name: 'loadOnInit',
    label: '是否启用初始加载数据',
  },
]

const data = {
  viewModels,
}
</script>

<template>
  <div>
    <FormKit v-model="dataSource" type="form" :actions="false" :incomplete-message="false">
      <FormKitSchema :schema :data />
    </FormKit>
  </div>
</template>
