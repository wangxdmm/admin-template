<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type {
  Field,
} from '@runafe/unified-api-designer'
import type { PropType } from 'vue'

const props = defineProps({
  buttonName: { // 添加按钮名称
    type: String,
    default: '添加查询条件',
  },
  nameField: { // 唯一字段
    type: String as PropType<keyof Field | string>,
    default: 'name',
  },
  labelField: { // 显示名称
    type: String,
    default: 'label',
  },
  deleteOne: {
    type: Boolean, // 为true是删除 false是保留
    default: true,
  },
  dragable: {
    type: Boolean, // 可拖拽true 不可以false
    default: true,
  },
})
const emits = defineEmits(['add', 'update', 'delete'])
defineExpose({ name: 'RnConditions' })
const list = defineModel<TODO>()

function addCondition() {
  emits('add')
}

function setConfig(row: Field, index: number) {
  emits('update', row, index)
}

function setVisiable(index: number) {
  if (list.value.length === 1 && !props.deleteOne) {
    emits('delete')
    return false
  }
  if (index > -1) {
    list.value.splice(index, 1)
  }
  list.value = Object.assign([], list.value)
}
</script>

<template>
  <div class="w-full m-auto">
    <n-button class="w-full" @click="addCondition">
      <template #icon>
        <SvgIcon icon="carbon:add" class="inline-block align-text-bottom text-20px" />
      </template>
      {{ props.buttonName ? props.buttonName : '添加查询条件' }}
    </n-button>
    <div class="h-14px" />
    <n-scrollbar style="max-height: 290px">
      <VueDraggable
        v-model="list"
        :animation="150"
        handle=".handle"
        class="flex flex-col gap-2 w-full"
      >
        <li
          v-for="(element, index) in list" :key="element[props.nameField] || index"
          class="flex b-1 b-solid h-32px pl-8px flex-sb_c b-#d9e2e8 w-full align--center rounded"
        >
          <span class="h-100% line-height-32px" :class="[props.dragable ? 'handle cursor-move' : '']">
            <SvgIcon icon="icon-park-outline:drag" class="inline-block align-text-bottom text-16px" />
          </span>
          <span class="flex-auto h-100% line-height-32px pl-6px text-12px"><slot name="name" :row="element">{{
            element[props.labelField]
          }}</slot></span>
          <span class="b-l-1px w-80px h-100% line-height-32px pl-10px">
            <n-button quaternary size="tiny" @click="setConfig(element, index)">
              <template #icon>
                <SvgIcon icon="ri:settings-line" class="inline-block align-text-bottom text-16px" />
              </template>
            </n-button>
            <n-button quaternary size="tiny" @click="setVisiable(index)">
              <template #icon>
                <SvgIcon icon="material-symbols:delete-outline" class="inline-block align-text-bottom text-16px" />
              </template>
            </n-button>
          </span>
        </li>
      </VueDraggable>
    </n-scrollbar>
  </div>
</template>

<style scoped>

</style>
