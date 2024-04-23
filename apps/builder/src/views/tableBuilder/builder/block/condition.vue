<script setup lang="ts">
import {VueDraggable} from 'vue-draggable-plus'

const props = defineProps({
  buttonName: {
    type: String,
    default: '添加查询条件',
  },
  nameField: {
    type: String,
    default: 'label'
  },
})
defineExpose({name: 'RnConditions'})
const emits = defineEmits(['add', 'update'])
const list = defineModel()

function addCondition() {
  emits('add')
}

function setConfig(row) {
  emits('update', row)
}

function setVisiable(data, index: number) {
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
    <div class="h-14px"/>
    <n-scrollbar style="max-height: 290px">
      <VueDraggable
        v-model="list"
        :animation="150"
        handle=".handle"
        class="flex flex-col gap-2 w-full"
      >
        <li v-for="(element, index) in list" :key="element[props.nameField]"
            class="flex b-1 b-solid h-32px pl-8px flex-sb_c b-#d9e2e8 w-full align--center">
          <span class="h-100% line-height-32px handle cursor-move">
            <SvgIcon icon="icon-park-outline:drag" class="inline-block align-text-bottom text-16px" />
          </span>
          <span class="flex-auto h-100% line-height-29px pl-6px text-12px"><slot name="name" :row="element">{{ element[props.nameField] }}</slot></span>
          <span class="b-l-1px w-80px h-100% line-height-32px pl-10px">
            <n-button quaternary size="tiny" @click="setConfig(element)">
              <template #icon>
                <SvgIcon icon="ri:settings-line" class="inline-block align-text-bottom text-16px" />
              </template>
            </n-button>
            <n-button quaternary size="tiny" @click="setVisiable(element,index)">
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
