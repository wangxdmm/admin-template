<script lang="ts" setup>
import RnConditions from './block/condition.vue'
import {useSetDialog} from './block/setDialog'
import {useColumnCondition} from ":/views/tableBuilder/builder/block/ColumnCondition";
import {unionBy} from "lodash-es";
const columnCondition = useColumnCondition()
const setDialog = useSetDialog()
const active = ref(false)
const show = ref(false)
const list=ref([])

function editQuery(row) {
  setDialog.open({
    type: 1, set(row) {

    }
  })
}

function editScreen(row) {
  setDialog.open({
    type: 2, set(row) {

    }
  })
}

function addScreen(){
  columnCondition.use({
   columns: [{name: 'name', label: '姓名', visible: true}, {name: 'age', label: '年龄', visible: true}, {
     name: 'sex',
     label: '性别',
     visible: true
   }], save(cols) {
     const selectArry = cols.filter(v => v.visible)
     list.value = [...unionBy(list.value, selectArry, 'name')]
   }
 })
}

watch(()=>list.value,(val)=>{
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
    <div>schema</div>
    <div class="absolute right-0 top-4px bottom-4px">
      <RsPlainCard content-class="w-400px p-16px!">
        <n-tabs type="line" animated>
          <n-tab-pane name="props" tab="表格属性">
            表格属性
          </n-tab-pane>
          <n-tab-pane name="query" tab="查询条件">
            <n-space vertical>
              <n-space justify="space-between">
                <label>是否启用查询</label>
                <n-switch v-model:value="active"/>
              </n-space>
              <n-space justify="space-between">
                <label>是否启用筛查</label>
                <n-switch v-model:value="active"/>
              </n-space>
            </n-space>
            <div class="my-10px">
              查询条件
            </div>
            <RnConditions @update="editQuery"/>
            <div class="my-10px">
              筛查条件
            </div>
            <RnConditions v-model="list" button-name="添加筛查条件" @update="editScreen" @add="addScreen"/>
          </n-tab-pane>
          <n-tab-pane name="colunmn" tab="表格列设置">
            表格列设置
          </n-tab-pane>
          <n-tab-pane name="feature" tab="统计指标">
            统计指标
          </n-tab-pane>
        </n-tabs>
      </RsPlainCard>
    </div>
  </div>
</template>
