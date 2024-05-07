<script lang="tsx" setup>
import type { UnifiedAction } from '@runafe/unified-api-designer'
import { tableSchema } from '../tableSchema'
import RowSelect from './rowSelect.vue'
import TreeTable from './treeTable.vue'
import Actions from './actions.vue'
import UserCustom from './userCustom.vue'

const generalButtons = computed<UnifiedAction[]>({
  get: () => tableSchema.value.actionConfig?.generalButtons || [],
  set: (val) => {
    tableSchema.value.actionConfig!.generalButtons = val
  },
})

const rowButtons = computed<UnifiedAction[]>({
  get: () => tableSchema.value.actionConfig?.rowButtons || [],
  set: (val) => {
    tableSchema.value.actionConfig!.rowButtons = val
  },
})

const cellActions = computed<UnifiedAction[]>({
  get: () => tableSchema.value.actionConfig?.cellActions || [],
  set: (val) => {
    tableSchema.value.actionConfig!.cellActions = val
  },
})

const rightClickMenus = computed<UnifiedAction[]>({
  get: () => tableSchema.value.actionConfig?.rightClickMenus || [],
  set: (val) => {
    tableSchema.value.actionConfig!.rightClickMenus = val
  },
})
</script>

<template>
  <div>
    <UserCustom />
    <RowSelect />
    <TreeTable />
    <Actions v-model="generalButtons" title="表格功能" />
    <Actions v-model="rowButtons" title="行功能" />
    <Actions v-model="cellActions" title="单元格功能" />
    <Actions v-model="rightClickMenus" title="右键菜单功能" />
  </div>
</template>
