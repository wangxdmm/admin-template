<script lang="ts" setup>
import type { Column, QueryConfig } from '@runafe/unified-api-designer'
import { unionBy } from 'lodash-es'
import RnConditions from './block/condition.vue'
import { useSetDialog } from './block/setDialog'
import RsHeaderTree from './block/headerTree.vue'
import TableConfig from './tableConfig/view.vue'
import { useColumnCondition } from ':/views/tableBuilder/builder/block/ColumnCondition'

const columnCondition = useColumnCondition()
const setDialog = useSetDialog()
const active = ref(false)
const show = ref(false)
const list = ref([])
const queryConfig = ref<QueryConfig>({
  enabled: false, // 启用
  generalQueryFields: [], // 普通查询字段
  advancedQueryFields: [], // 高级查询字段
})

const columns = ref<Column[]>()

function editQuery(row) {
  setDialog.open({
    type: 1,
    set(row) {

    },
  })
}

function addQuery() {
  columnCondition.use({
    columns: [
      { name: 'name', label: '姓名', matcher: '', inputComponent: '', defaultValue: '', visible: true },
      { name: 'age', label: '年龄', matcher: '', inputComponent: '', defaultValue: '', visible: true },
      { name: 'sex', label: '性别', matcher: '', inputComponent: '', defaultValue: '', visible: true },
    ],
    save(cols) {
      const selectArry = cols.filter(v => v.visible)
      queryConfig.value.generalQueryFields = [...unionBy(list.value, selectArry, 'name')]
    },
  })
}

function editScreen(row) {
  setDialog.open({
    type: 2,
    set(row) {

    },
  })
}

function addScreen() {
  columnCondition.use({
    columns: [
      { name: 'name', label: '姓名', matcher: '', visible: true },
      { name: 'age', label: '年龄', matcher: '', visible: true },
      { name: 'sex', label: '性别', matcher: '', visible: true },
    ],
    save(cols) {
      const selectArry = cols.filter(v => v.visible)
      queryConfig.value.advancedQueryFields = [...unionBy(list.value, selectArry, 'name')]
    },
  })
}

watch(() => list.value, (val) => {
})
</script>

<template>
  <div class="relative size-full p-16px">
    <div class="flex-s_c gap-16px">
      <NButton
        size="medium"
        type="primary"
        @click="
          () => {
            show = true
          }
        "
      >
        保存
      </NButton>
      <NButton type="primary">
        发布
      </NButton>
    </div>
    <div>{{ queryConfig }}</div>
    <div class="absolute right-0 top-4px bottom-4px">
      <RsPlainCard content-class="w-400px p-16px!">
        <n-tabs type="line" animated>
          <n-tab-pane name="props" tab="表格属性">
            <TableConfig />
          </n-tab-pane>
          <n-tab-pane name="query" tab="查询条件">
            <n-space justify="space-between">
              <label>启用</label>
              <n-switch v-model:value="queryConfig.enabled" />
            </n-space>
            <div class="my-10px">
              查询条件
            </div>
            <RnConditions v-model="queryConfig.generalQueryFields" @update="editQuery" @add="addQuery" />
            <div class="my-10px">
              筛查条件
            </div>
            <RnConditions
              v-model="queryConfig.advancedQueryFields" button-name="添加筛查条件" @update="editScreen"
              @add="addScreen"
            />
          </n-tab-pane>
          <n-tab-pane name="colunmn" tab="表格列设置">
            <n-scrollbar style="max-height: 800px">
              <div class="my-10px">
                表格列设置
              </div>
              <RnConditions v-model="queryConfig.generalQueryFields" @update="editQuery" @add="addQuery" />
              <div class="my-10px">
                表头分组设置
              </div>
              <n-button class="w-full">
                <template #icon>
                  <SvgIcon icon="carbon:add" class="inline-block align-text-bottom text-20px" />
                </template>
                添加表头分组
              </n-button>
              <RsHeaderTree />
            </n-scrollbar>
          </n-tab-pane>
          <n-tab-pane name="actions" tab="功能设置">
            功能设置
          </n-tab-pane>
          <n-tab-pane name="feature" tab="添加表格列">
            统计指标
          </n-tab-pane>
        </n-tabs>
      </RsPlainCard>
    </div>
  </div>
</template>
