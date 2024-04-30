<script lang="tsx" setup>
import type { DataSource } from '@runafe/unified-api-designer'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { titleClass } from '../share'
import { tableSchema } from '../tableSchema'
import { viewModelFields } from '../viewModels'
import Criterias from '../criterias.vue'

const dataSource = computed<DataSource & Record<string, any>>({
  get: () => tableSchema.value.dataSource || {},
  set: (val) => {
    tableSchema.value.dataSource = val
  },
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
    $formkit: 'n:text',
    name: 'viewTitle',
    label: '视图名称',
    disabled: true,
  },
  {
    $formkit: 'n:select',
    name: 'primaryKeyFieldName',
    label: '视图唯一标识字段',
    options: '$viewModelFields',
    valueField: 'name',

  },
  {
    $formkit: 'n:text',
    name: 'serverName',
    label: '服务名',
    disabled: true,
  },
  {
    $cmp: 'Criterias',
    props: {
      modelValue: '$dataSource.filter',
      label: '数据范围',

    },

  },
  {
    $formkit: 'n:switch',
    name: 'loadOnInit',
    label: '是否启用初始加载数据',
  },
]

const library = markRaw({
  Criterias,
})

const data = {
  dataSource,
  viewModelFields,
}
</script>

<template>
  <div>
    <FormKit
      v-model="dataSource"
      type="form"
      :actions="false"
      :incomplete-message="false"
    >
      <FormKitSchema :schema :library :data />
    </FormKit>
  </div>
</template>
