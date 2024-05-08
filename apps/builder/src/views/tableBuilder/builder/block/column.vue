<script setup lang="tsx">
import type { FormKitNode, FormKitSchemaDefinition } from '@formkit/core'
import { getNode } from '@formkit/core'
import { ValueType } from '@runafe/unified-api-designer'
import type { ColorSchema, Column } from '@runafe/unified-api-designer'
import type { PropType } from 'vue'
import { FormKit, FormKitSchema } from '@formkit/vue'

import { defineModal } from '@runafe/magic-system'
import RnConditions from './condition.vue'

const props = defineProps({
  row: {
    type: Object as PropType<Column>,
  },
  set: {
    type: Function,
  },
})
const emits = defineEmits(['close'])
defineExpose({ name: 'RsColunm', submitHandle })
const modal = defineModal({
  width: 400,
})

const library = markRaw({
  RnConditions,
})
const bgConfigSchema: FormKitSchemaDefinition = [
  {
    $formkit: 'n:text',
    name: 'name',
    label: '名称',
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
    name: 'condition',
    label: '条件',
    validation: 'required',
  },
]

function agAdd(data: ColorSchema, index: number) {
  addColors({ colorSchema: data, index, type: 1 })
}

function bgAdd(data: ColorSchema, index: number) {
  addColors({ colorSchema: data, index, type: 2 })
}

const columns = ref<Column>({
  name: '',
  label: '',
  render: '',
  type: ValueType.STRING,
  backgroundColors: [],
  colors: [],
})

function submit() {
  const values = getNode('FormKitRef')?.value
  if (props.set) {
    props.set(values)
  }
  emits('close')
}

function submitHandle() {
  getNode('FormKitRef')?.submit()
}

const data = ref({
  colors: computed(() => columns.value.colors),
  backgroundColors: computed(() => columns.value.backgroundColors),
  actions: {
    agAdd,
    bgAdd,
  },
})
const userSchema: FormKitSchemaDefinition
  = {
    $cmp: 'n-grid',
    props: {
      cols: '2',
      xGap: '20',
    },
    children: [
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:text',
          name: 'name',
          id: 'name',
          label: '唯一标识',
          disabled: true,
          maxlength: 50,
          validation: [['required'], ['matches', '/^[a-zA-Z0-9_]+$/']],
          validationMessages: { matches: '请输入正确的唯一标识' },
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:text',
          name: 'label',
          id: 'label',
          validation: 'required',
          label: '显示名',
          maxlength: 10,
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:textarea',
          name: 'description',
          id: 'description',
          label: '描述',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:select',
          name: 'align',
          id: 'align',
          label: '对齐方式',
          options: [{ label: '左对齐', value: 'LEFT' }, { label: '居中对齐', value: 'CENTER' }, {
            label: '右对齐',
            value: 'RIGHT',
          }],
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:switch',
          name: 'resizable',
          id: 'resizable',
          label: '允许拖动列宽',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:switch',
          name: 'sortable',
          id: 'sortable',
          label: '允许排序',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:select',
          name: 'fixed',
          id: 'fixed',
          label: '固定位置',
          options: [{ label: '左', value: 'LEFT' }, { label: '不固定', value: 'NONE' }, { label: '右', value: 'RIGHT' }],
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:select',
          name: 'type',
          id: 'type',
          label: '类型',
          options: [{ label: '布尔值', value: 'BOOLEAN' }, { label: '字符串', value: 'STRING' }, { label: '日期', value: 'DATE' }, { label: '枚举值', value: 'ENUM' }, { label: '数字', value: 'NUMBER' }],
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:switch',
          name: 'wordWrap',
          id: 'wordWrap',
          label: '自动换行',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:number',
          name: 'textRows',
          id: 'textRows',
          max: 10,
          min: 2,
          label: '文本行数',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:number',
          name: 'precision',
          id: 'precision',
          label: '精度',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:switch',
          name: 'showThousandSeparator',
          id: 'showThousandSeparator',
          label: '显示千分位',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:textarea',
          name: 'render',
          id: 'render',
          label: '渲染器',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $formkit: 'n:switch',
          name: 'useCopy',
          id: 'useCopy',
          label: '启用复制',
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $el: 'p',
          attrs: {
            class: 'm-b-10px',
          },
          children: '前景色设置',
        }, {
          $cmp: 'RnConditions',
          props: {
            modelValue: '$colors',
            buttonName: '添加前景色',
            onAdd: '$actions.agAdd',
            onUpdate: '$actions.agAdd',
            nameField: 'name',
            labelField: 'name',
          },
        }],
      },
      {
        $cmp: 'n-gi',
        children: [{
          $el: 'p',
          attrs: {
            class: 'm-b-10px',
          },
          children: '背景色设置',
        }, {
          $cmp: 'RnConditions',
          props: {
            modelValue: '$backgroundColors',
            buttonName: '添加背景色',
            onAdd: '$actions.bgAdd',
            onUpdate: '$actions.bgAdd',
            nameField: 'name',
            labelField: 'name',
          },
        }],
      },
    ],
  }
const config = reactive({
  validationVisibility: 'dirty',
  outerClass: 'half',
  labelPlacement: 'left',
  labelAlign: 'right',
  labelWidth: 100,
  size: 'small',
})
function addColors(option: { colorSchema?: ColorSchema, index?: number, type: number }) {
  const bgForm = ref<ColorSchema>({} as ColorSchema)
  if (option.colorSchema) {
    bgForm.value = { ...option.colorSchema }
  }
  let formNode: FormKitNode
  modal.load({
    title: () => '背景颜色',
    default: () => <FormKit type="form" v-model={bgForm.value} onNode={(n: FormKitNode) => {
      formNode = n
    }} actions={false} incomplete-message={false} onSubmit={() => {
      if (option.type === 1) {
        if (option.index) {
          (columns.value.colors ?? [])[option.index] = { ...bgForm.value }
        }
        else {
          (columns.value.colors ?? []).push(bgForm.value)
        }
      }
      else {
        if (option.index) {
          (columns.value.backgroundColors ?? [])[option.index] = { ...bgForm.value }
        }
        else {
          (columns.value.backgroundColors ?? []).push(bgForm.value)
        }
      }
      modal.close()
    }}>
      <FormKitSchema schema={bgConfigSchema}></FormKitSchema>
    </FormKit>,
    footer: () => [
      <n-button onClick={() => {
        modal.close()
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
onMounted(() => {
  columns.value = Object.assign(columns.value, props.row)
})
</script>

<template>
  <FormKit
    id="FormKitRef"
    v-model="columns"
    :config="config"
    type="form"
    :actions="false"
    :incomplete-message="false"
    @submit="submit"
  >
    <FormKitSchema :schema="userSchema" :data="data" :library="library" />
  </FormKit>
</template>
