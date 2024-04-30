<script lang="tsx" setup>
import type { ColorSchema, StyleConfig } from '@runafe/unified-api-designer'
import type { FormKitNode, FormKitSchemaDefinition } from '@formkit/core'
import { defineModal } from '@runafe/magic-system'
import { FormKit, FormKitSchema } from '@formkit/vue'
import RnConditions from '../block/condition.vue'
import { tableSchema } from '../tableSchema'

const styleConfig = computed<Partial<StyleConfig>>({
  get: () => tableSchema.value.styleConfig!,
  set: (val) => {
    tableSchema.value.styleConfig = val
  },
})

const { close, load } = defineModal({ width: 600 })

const data = {
  styleConfig,
  options: {
    viewModel: [],
  },
  titleClass: 'font-bold m-b-10px',
  actions: {
    bgAdd: () => {
      bgEdit()
    },
    bgEdit: (row: ColorSchema, index: number) => {
      bgEdit(row, index)
    },
  },
}

const library = markRaw({
  RnConditions,
})

const schema: FormKitSchemaDefinition = [
  {
    $el: 'p',
    children: '样式',
    attrs: {
      class: '$titleClass',
    },
  },
  {
    $formkit: 'n:switch',
    name: 'bordered',
    label: '启用边框',
  },
  {
    $formkit: 'n:switch',
    name: 'stripe',
    label: '启用斑马线',
  },
  {
    $formkit: 'n:number',
    name: 'rowHeight',
    label: '行高',
    showButton: false,
    slots: {
      suffix: () => 'px', // TODO
    },
  },
  {
    $el: 'p',
    attrs: {
      class: 'm-b-10px',
    },
    children: '行背景色',
  },
  {
    $cmp: 'RnConditions',
    props: {
      modelValue: '$styleConfig.rowBackgroundColors',
      buttonName: '添加行背景色',
      onAdd: '$actions.bgAdd',
      onUpdate: '$actions.bgEdit',
      labelField: 'name',
      class: 'm-b-20px',
    },
  },
]

const bgConfigSchema: FormKitSchemaDefinition = [
  {
    $formkit: 'n:text',
    name: 'name',
    label: '策略名称',
    validation: 'required',
  },
  {
    $formkit: 'n:text',
    name: 'value',
    label: '色号',
    validation: 'required',
  },
  {
    $formkit: 'n:text',
    name: 'condtion',
    label: '启用条件',
    validation: 'required',
  },
]

function bgEdit(row?: ColorSchema, index?: number) {
  const bgForm = ref<ColorSchema>(row || ({} as ColorSchema))
  let formNode: FormKitNode
  load({
    title: () => '背景颜色',
    default: () => (
      <FormKit
        type="form"
        v-model={bgForm.value}
        onNode={(n: FormKitNode) => {
          formNode = n
        }}
        actions={false}
        incomplete-message={false}
        onSubmit={() => {
          if (index || index === 0) {
            styleConfig.value.rowBackgroundColors![index] = bgForm.value
          }
          else {
            styleConfig.value.rowBackgroundColors?.push(bgForm.value)
          }
          close()
        }}
      >
        <FormKitSchema schema={bgConfigSchema}></FormKitSchema>
      </FormKit>
    ),
    footer: () => [
      <n-button
        onClick={() => {
          close()
        }}
      >
        关闭
      </n-button>,
      <n-button
        type="primary"
        onClick={() => {
          formNode?.submit()
        }}
      >
        保存
      </n-button>,
    ],
  }).open()
}
</script>

<template>
  <div>
    <FormKit
      v-model="styleConfig"
      type="form"
      :actions="false"
      :incomplete-message="false"
    >
      <FormKitSchema :schema :data :library />
    </FormKit>
  </div>
</template>
