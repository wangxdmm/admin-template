<script lang="ts" setup>
import type { TableSchema } from '@runafe/unified-api-designer'
import { useRoute } from 'vue-router'
import { defineSchemaTable } from '@runafe/magic-system'
import TableConfig from './tableConfig/view.vue'
import ActionConfig from './actionConfig/view.vue'
import { tableSchema } from './tableSchema'
import Query from './block/query.vue'
import tableColumn from './block/tableColumn.vue'
import { designerDoApplication } from ':/api'

const show = ref(false)
const router = useRoute()
async function loadCode() {
  const { code } = router.query
  const { backData } = await designerDoApplication.getByCode({ code })()
  if (backData) {
    tableSchema.value = { ...tableSchema.value, ...backData } as TableSchema
  }
}
const Schema = defineSchemaTable(tableSchema, {
  data: {},
})

watch(
  tableSchema,
  () => {
    Schema.init()
  },
  {
    deep: true,
  },
)

onMounted(() => {
  loadCode()
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
    <div class="flex">
      <!-- <pre>{{ tableSchema }}</pre> -->
      <div class="size-600px mt-16px">
        <Schema.Component />
      </div>
      <pre class="size-600px overflow-auto">
        {{ tableSchema }}
      </pre>
    </div>
    <div class="absolute right-0 top-4px bottom-4px">
      <RsPlainCard content-class="w-400px p-16px! overflow-y-scroll">
        <n-tabs type="line" animated>
          <n-tab-pane name="props" tab="表格属性">
            <TableConfig />
          </n-tab-pane>
          <n-tab-pane name="query" tab="查询条件">
            <Query />
          </n-tab-pane>
          <n-tab-pane name="colunmn" tab="表格列设置">
            <tableColumn />
          </n-tab-pane>
          <n-tab-pane name="actions" tab="功能设置">
            <ActionConfig />
          </n-tab-pane>
          <n-tab-pane name="feature" tab="添加表格列">
            统计指标
          </n-tab-pane>
        </n-tabs>
      </RsPlainCard>
    </div>
  </div>
</template>
