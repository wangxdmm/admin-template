<script lang="ts" setup>
import RnConditions from './block/condition.vue'

const active = ref(false)
const show = ref(false)
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
                <n-switch v-model:value="active" />
              </n-space>
              <n-space justify="space-between">
                <label>是否启用筛查</label>
                <n-switch v-model:value="active" />
              </n-space>
            </n-space>
            <div class="my-10px">
              查询条件
            </div>
            <RnConditions :button-type="1" />
            <div class="my-10px">
              筛查条件
            </div>
            <RnConditions button-name="添加筛查条件" :button-type="2" />
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
