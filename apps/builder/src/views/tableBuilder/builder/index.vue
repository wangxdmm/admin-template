<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { defineModal, defineSchemaTable } from '@runafe/magic-system'
import { useMessage } from 'naive-ui'
import { Editor } from '@runafe/js-editor'
import TableConfig from './tableConfig/view.vue'
import ActionConfig from './actionConfig/view.vue'
import { getCache, restData, tableSchema, updateSchema } from './tableSchema'
import { updateViewModel } from './viewModels'
import Query from './block/query.vue'
import tableColumn from './block/tableColumn.vue'
import { designerDoApplication } from ':/api'

const codeModal = defineModal({
  width: 800,
  attrs: {
    noPadding: true,
  },
})

const router = useRoute()
const rsMassage = useMessage()
async function loadCode() {
  const { code } = router.query as { code: string }
  const { backData } = await designerDoApplication.getTableSchema({ code })()
  if (backData) {
    updateSchema(backData)
    const { backData: models } = await designerDoApplication.getByCode({
      code: backData.dataSource.viewModelCode,
    })()
    if (models) {
      updateViewModel(models)
    }
  }
}
async function saveAndRelease() {
  const { result, message } = await designerDoApplication.saveAndRelease(
    tableSchema.value,
  )()
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
  const { result, message } = await designerDoApplication.save(
    tableSchema.value,
  )()
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
    return h(Editor, {
      doc: JSON.stringify(tableSchema.value, null, 2),
      class: ['h-600px'],
    })
  },
})

const cls = um_dss('rs-content-wrap', ['p-0!'])
</script>

<template>
  <div class="relative size-full p-16px">
    <div class="flex um_calc('100% - 430px', 'w') h-full">
      <rs-content class="w-full">
        <template #top>
          <div class="flex-s_c gap-16px">
            <button-icon
              class="text-primary text-20px"
              icon="uil:save"
              tooltip-content="保存"
              @click="save"
            />
            <button-icon
              class="text-primary text-20px"
              icon="ic:outline-published-with-changes"
              tooltip-content="发布"
              @click="saveAndRelease"
            />
            <n-popconfirm @positive-click="resetFormdata">
              <template #trigger>
                <div>
                  <button-icon
                    class="text-primary text-20px"
                    icon="ic:outline-reset-tv"
                    tooltip-content="重置"
                  />
                </div>
              </template>
              请确认是否重置数据？
            </n-popconfirm>
            <button-icon
              class="text-primary text-20px"
              icon="lets-icons:json"
              tooltip-content="查看schema"
              @click="() => codeModal.open()"
            />
            <button-icon
              class="text-primary text-20px"
              icon="iconoir:refresh-circle"
              tooltip-content="刷新表格数据"
              @click="() => Schema.Table.context.refresh()"
            />
          </div>
        </template>
        <template #default="{ style }">
          <div :style :class="[cls]">
            <Schema.Component />
          </div>
        </template>
      </rs-content>
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
