<script lang="tsx" setup>
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import type {
  Column,
  Field,
} from '@runafe/unified-api-designer'
import { isArray, unionBy } from 'lodash-es'
import { tableSchema } from '../tableSchema'
import { useColumnDialog } from './columnDialog'
import RnConditions from './condition.vue'
import { useColumnCondition } from './ColumnCondition'
import RsHeaderTree from './headerTree.vue'

defineExpose({ name: 'TableColumn' })
const columnCondition = useColumnCondition()
const columnDialog = useColumnDialog()
const message = useMessage()
const columns = computed<Column[]>({
  get: () => tableSchema.value.columns || [],
  set: (val: Column[]) => {
    tableSchema.value.columns = val
  },
})
const fields = computed<Field[]>(() => tableSchema.value.fields ?? [])

function editColumn(row: Column, index: number) {
  columnDialog.open({
    row,
    set(data) {
      tableSchema.value.columns[index] = { ...tableSchema.value.columns[index], ...data }
    },
  })
}

function addColumn() {
  if (!isArray(fields.value) || fields.value.length === 0) {
    message.warning('配置列为空')
    return
  }
  const selectNames = columns.value.map(v => v.name)
  const allColumn = fields.value.map((n) => {
    if (selectNames.includes(n.name)) {
      n.selectable = true
    }
    else {
      n.selectable = false
    }
    return n
  })
  columnCondition.use({
    columns: allColumn,
    save(cols: Field[]) {
      const names: string[] = []
      const selectArry = cols.filter((v) => {
        if (v.selectable) {
          names.push(v.name)
        }
        return v.selectable
      },
      )
      columns.value = [...unionBy(columns.value.filter(f => names.includes(f.name)), selectArry, 'name')]
    },

  })
}
</script>

<template>
  <n-scrollbar style="max-height: 780px">
    <div class="my-10px">
      表格列设置
    </div>
    <RnConditions v-model="columns" @update="editColumn" @add="addColumn" />
    <div class="my-10px">
      表头分组设置
    </div>
    <RsHeaderTree />
  </n-scrollbar>
</template>
