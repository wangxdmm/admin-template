<script lang="tsx" setup>
import type { UnifiedAction } from '@runafe/unified-api-designer'
import RowSelect from './rowSelect.vue'
import TreeTable from './treeTable.vue'
import Actions from './actions.vue'

const generalButtons = ref<UnifiedAction[]>([
  { name: '111', label: '删除' },
] as UnifiedAction[])

const rowButtons = ref<UnifiedAction[]>([
  { name: '111', label: '删除' },
] as UnifiedAction[])

const cellActions = ref<UnifiedAction[]>([
  { name: '111', label: '删除' },
] as UnifiedAction[])
const rightClickMenus = ref<UnifiedAction[]>([
  { name: '111', label: '删除' },
] as UnifiedAction[])
</script>

<template>
  <div>
    <RowSelect />
    <TreeTable />
    <Actions v-model="generalButtons" title="表格功能" />
    <Actions v-model="rowButtons" title="行功能" />
    <Actions v-model="cellActions" title="单元格功能" />
    <Actions v-model="rightClickMenus" title="右键菜单功能" />
  </div>
</template>
