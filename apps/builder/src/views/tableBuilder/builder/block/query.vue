<script lang="tsx" setup>
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import type {
  AdvancedQueryField,
  GeneralQueryField,
  QueryConfig,
} from '@runafe/unified-api-designer'
import { isArray, unionBy } from 'lodash-es'
import { tableSchema } from '../tableSchema'
import { viewModelFields } from '../viewModels'
import { useSetDialog } from './setDialog'
import RnConditions from './condition.vue'
import { useColumnCondition } from './ColumnCondition'
import type { FieldCheck } from ':/views/tableBuilder/builder/block/common'

defineExpose({ name: 'Query' })
const setDialog = useSetDialog()
const columnCondition = useColumnCondition()
const massage = useMessage()
const queryConfig = computed<QueryConfig>({
  get: () => {
    if (tableSchema.value.queryConfig) {
      return tableSchema.value.queryConfig
    }
    else {
      return tableSchema.value.queryConfig = { enabled: false, generalQueryFields: [], advancedQueryFields: [] }
    }
  },
  set: (val: QueryConfig) => {
    tableSchema.value.queryConfig = val
  },
})
function addQuery() {
  if (!isArray(viewModelFields.value) || viewModelFields.value.length === 0) {
    massage.warning('配置列为空')
    return
  }
  const selectNames = queryConfig.value.generalQueryFields.map(v => v.name)
  const allColumn = (viewModelFields.value as unknown as FieldCheck[])
    .filter(item => item.filterable)
    .map((n) => {
      if (selectNames.includes(n.name)) {
        n.check = true
      }
      else {
        n.check = false
      }
      return n
    })
  if (allColumn.length === 0) {
    massage.warning('没有可选查询列')
    return false
  }
  columnCondition.use({
    columns: allColumn,
    save(cols: FieldCheck[]) {
      const names: string[] = []
      const selectArry = cols.filter((v) => {
        if (v.check) {
          names.push(v.name)
        }
        return v.check
      },
      ) as unknown as GeneralQueryField[]
      queryConfig.value.generalQueryFields = [
        ...unionBy(queryConfig.value.generalQueryFields.filter(t => names.includes(t.name)), selectArry, 'name'),
      ]
    },
  })
}

function editQuery(row: GeneralQueryField, index: number) {
  setDialog.open<GeneralQueryField>({
    type: 1,
    row,
    set(data) {
      queryConfig.value.generalQueryFields[index] = { ...data }
    },
  })
}

function editScreen(row: AdvancedQueryField, index: number) {
  setDialog.open<AdvancedQueryField>({
    type: 2,
    row,
    set(data) {
      queryConfig.value.advancedQueryFields[index] = { ...data }
    },
  })
}

function addScreen() {
  if (!isArray(viewModelFields.value) || viewModelFields.value.length === 0) {
    massage.warning('配置列为空')
    return
  }
  const selectNames = queryConfig.value.advancedQueryFields.map(v => v.name)
  const allColumn = (viewModelFields.value as unknown as FieldCheck[])
    .filter(item => item.filterable)
    .map((n) => {
      if (selectNames.includes(n.name)) {
        n.check = true
      }
      else {
        n.check = false
      }
      return n
    })
  if (allColumn.length === 0) {
    massage.warning('没有可选查询列')
    return false
  }
  columnCondition.use({
    title: '添加筛查条件',
    columns: allColumn,
    save(cols: FieldCheck[]) {
      const names: string[] = []
      const selectArry = cols.filter((v) => {
        if (v.check) {
          names.push(v.name)
        }
        return v.check
      },
      ) as unknown as AdvancedQueryField[]
      queryConfig.value.advancedQueryFields = [
        ...unionBy(queryConfig.value.advancedQueryFields.filter(v => names.includes(v.name)), selectArry, 'name'),
      ]
    },
  })
}
</script>

<template>
  <n-scrollbar style="max-height: 780px">
    <n-space justify="space-between">
      <label>启用</label>
      <n-switch v-model:value="queryConfig.enabled" />
    </n-space>
    <div class="my-10px">
      查询条件
    </div>
    <RnConditions
      v-model="queryConfig.generalQueryFields"
      @update="editQuery"
      @add="addQuery"
    />
    <div class="my-10px">
      筛查条件
    </div>
    <RnConditions
      v-model="queryConfig.advancedQueryFields"
      button-name="添加筛查条件"
      @update="editScreen"
      @add="addScreen"
    />
  </n-scrollbar>
</template>
