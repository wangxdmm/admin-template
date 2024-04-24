<script lang="tsx" setup>
import type { TableSchema } from '@runafe/unified-api-designer'
import DataSource from './dataSource.vue'
import StyleConfig from './StyleConfig.vue'

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
  </div>
</template>
