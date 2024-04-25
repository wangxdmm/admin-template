<script lang="tsx" setup>
import type { TableSchema } from '@runafe/unified-api-designer'
import DataSource from './dataSource.vue'
import StyleConfig from './styleConfig.vue'
import Pagination from './pagination.vue'

const tableConfig = ref<TableSchema>({} as unknown as TableSchema)

watch(() => tableConfig.value, () => {

}, {
  deep: true,
})
</script>

<template>
  <div>
    <DataSource />
    <StyleConfig />
    <Pagination />
  </div>
</template>
