<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { defineSchemaTable } from '@runafe/magic-system'
import TableConfig from './tableConfig/view.vue'
import ActionConfig from './actionConfig/view.vue'
import { tableSchema, updateSchema } from './tableSchema'
import { updateViewModel } from './viewModels'
import Query from './block/query.vue'
import tableColumn from './block/tableColumn.vue'
import { designerDoApplication } from ':/api'

const show = ref(false)
const router = useRoute()
async function loadCode() {
  const { code } = router.query as { code: string }
  const { backData } = await designerDoApplication.getTableSchema({ code })()
  if (backData) {
    updateSchema({ ...backData, dataSource: { serverName: 'charge-manager' } })
    const { backData: models } = await designerDoApplication.getByCode({ code: backData.dataSource.viewModelCode })()
    if (models) {
      updateViewModel(models)
    }
  }
}

const Schema = defineSchemaTable(tableSchema, {
  data: {},
})

onMounted(() => {
  loadCode()
})
</script>

<template>
  <div class="relative size-full p-16px">
    <div class="flex-s_c gap-16px bg-#fff mr-400px p-8px">
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
      <NButton type="success">
        重置
      </NButton>
      <NButton type="success">
        查看schema
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
    <div class="absolute right-0 top-4px bottom-4px bg-#fff w-420px">
      <n-scrollbar>
        <div class="p-16px">
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
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>
