<script lang="ts" setup>
import type { TableSchema } from '@runafe/unified-api-designer'
import { schema } from './schema'

const tableConfig = ref<TableSchema>({
  dataSource: {
    viewModelCode: 'string',
    serverName: 'string',
    filter: 'string',
    loadOnInit: true,
    primaryKeyFieldName: 'string',
  },
} as TableSchema)

const data = {
  tableConfig,
  options: {
    viewModel: [],
  },
  titleClass: 'font-bold m-b-10px',
}

watch(() => tableConfig.value, (val) => {
}, {
  deep: true,
})
</script>

<template>
  <div>
    <FormKitSchema :schema="schema" :data />
  </div>
</template>
