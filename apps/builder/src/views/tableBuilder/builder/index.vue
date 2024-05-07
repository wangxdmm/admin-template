<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { defineModal, defineSchemaTable } from '@runafe/magic-system'
import { useMessage } from 'naive-ui'
import { JsonViewer } from 'vue3-json-viewer'
import TableConfig from './tableConfig/view.vue'
import ActionConfig from './actionConfig/view.vue'
import { getCache, restData, tableSchema, updateSchema } from './tableSchema'
import { updateViewModel } from './viewModels'
import Query from './block/query.vue'
import tableColumn from './block/tableColumn.vue'
import { designerDoApplication } from ':/api'

const codeModal = defineModal({
  width: 800,
})

const router = useRoute()
const rsMassage = useMessage()
async function loadCode() {
  const { code } = router.query as { code: string }
  const { backData } = await designerDoApplication.getTableSchema({ code })()
  if (backData) {
    updateSchema(backData)
    const { backData: models } = await designerDoApplication.getByCode({ code: backData.dataSource.viewModelCode })()
    if (models) {
      updateViewModel(models)
    }
  }
}
async function saveAndRelease() {
  const { result, message } = await designerDoApplication.saveAndRelease(tableSchema.value)()
  if (result) {
    rsMassage.success(message ?? '发布成功')
  }
}
const Schema = defineSchemaTable(tableSchema, {
  data: {},
})
function resetFormdata() {
  if (getCache() === JSON.stringify(tableSchema.value)) {
    return rsMassage.warning('当前数据没有修改，不能重置！')
  }
  updateSchema(restData())
}
async function save() {
  const { result, message } = await designerDoApplication.save(tableSchema.value)()
  if (result) {
    rsMassage.success(message ?? '保存成功')
  }
}
onMounted(() => {
  loadCode()
})

codeModal.load({
  title: () => tableSchema.value.name,
  default: () => {
    return h(JsonViewer, {
      value: tableSchema.value,
      copyable: true,
      class: [um_dss('jv-code', ['p-0!'])],
    })
  },
})
</script>

<template>
  <div class="relative size-full p-16px">
    <div class="flex-s_c gap-16px bg-#fff mr-400px p-8px">
      <NButton size="medium" type="primary" @click="save">
        保存
      </NButton>
      <NButton type="primary" @click="saveAndRelease">
        发布
      </NButton>
      <n-popconfirm @positive-click="resetFormdata">
        <template #trigger>
          <NButton type="success">
            重置
          </NButton>
        </template>
        请确认是否重置数据？
      </n-popconfirm>
      <NButton type="success" @click="() => codeModal.open()">
        查看schema
      </NButton>
    </div>
    <div class="flex">
      <!-- <pre>{{ tableSchema }}</pre> -->
      <div class="um_calc('100% - 460px', 'w') mt-16px h-800px">
        <Schema.Component />
      </div>
    </div>
    <div class="absolute right-0 top-4px bottom-4px w-420px shadow">
      <DarkModeContainer class="h-full">
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
      </DarkModeContainer>
    </div>
  </div>
</template>
