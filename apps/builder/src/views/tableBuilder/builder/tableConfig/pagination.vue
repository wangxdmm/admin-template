<script lang="tsx" setup>
import type { Pagination, PaginationSize } from '@runafe/unified-api-designer'
import type { FormKitNode, FormKitSchemaDefinition } from '@formkit/core'
import { HorizontalAlign } from '@runafe/unified-api-designer'
import { defineModal } from '@runafe/magic-system'
import { FormKit, FormKitSchema } from '@formkit/vue'
import RnConditions from '../block/condition.vue'
import { tableSchema } from '../tableSchema'

const pagination = computed<Pagination>({
  get: () => tableSchema.value.pagination || {},
  set: (val) => {
    tableSchema.value.pagination = val
  },
})

const pageSizes = computed(() => pagination.value.pageSizes?.map(p => ({ ...p, label: `${p.size}行${p.defaultOption ? '（默认）' : ''}` })))
const { close, load } = defineModal({ width: 400 })

const data = {
  pageSizes,
  options: {
    align: [
      { value: HorizontalAlign.RIGHT, label: '右对齐' },
      { value: HorizontalAlign.LEFT, label: '左对齐' },
      { value: HorizontalAlign.CENTER, label: '居中对齐' },
    ],
  },
  titleClass: 'font-bold m-b-10px',
  actions: {
    sizeAdd: () => {
      edit()
    },
    sizeEdit: (row: PaginationSize, index: number) => {
      edit(row, index)
    },
  },
}

const library = markRaw({
  RnConditions,
})

const schema: FormKitSchemaDefinition = [
  {
    $el: 'p',
    children: '翻页器',
    attrs: {
      class: '$titleClass',
    },
  },
  {
    $formkit: 'n:switch',
    id: 'paginationEnabled',
    name: 'enabled',
    label: '是否启用',
  },
  {
    $el: 'div',
    if: '$get(paginationEnabled).value',
    children: [
      {
        $cmp: 'RnConditions',
        props: {
          modelValue: '$pageSizes',
          buttonName: '添加每页显示行数',
          onAdd: '$actions.sizeAdd',
          onUpdate: '$actions.sizeEdit',
          class: 'm-b-20px',
        },
      },
      {
        $formkit: 'n:select',
        name: 'align',
        label: '对齐方式',
        value: 'RIGHT',
        options: '$options.align',
      },
      {
        $formkit: 'n:number',
        name: 'pagerCount',
        label: '显示页码按钮数量',
        value: 5,
        showButton: false,
        min: 2,
        max: 10,
      },
      {
        $formkit: 'n:switch',
        name: 'showTotal',
        label: '是否显示总数',
      },
      {
        $formkit: 'n:switch',
        name: 'numberJump',
        label: '是否允许页码跳转',
      },
      // {
      //   $formkit: 'n:switch',
      //   name: 'endless',
      //   label: '是否开启无尽模式',
      // },
    ],
  },

]

const bgConfigSchema: FormKitSchemaDefinition = [
  {
    $formkit: 'n:number',
    name: 'size',
    label: '行数',
    validation: 'required',
    showButton: false,
    min: 10,
    max: 3000,
  },
  {
    $formkit: 'n:switch',
    name: 'defaultOption',
    label: '是否默认',
  },
]

function edit(row?: PaginationSize, index?: number) {
  const sizeForm = ref<PaginationSize>(row || {} as PaginationSize)

  let formNode: FormKitNode
  load({
    title: () => '每页行数设置',
    default: () => <FormKit type="form"
            v-model={sizeForm.value}
            onNode={(n: FormKitNode) => {
              formNode = n
            }}
            actions={false}
            incomplete-message={false}
            onSubmit={() => {
              const { size, defaultOption } = sizeForm.value
              if (defaultOption) {
                pagination.value.pageSizes?.forEach((p) => {
                  p.defaultOption = false
                })
              }
              pagination.value.pageSizes?.push({ size, defaultOption })
              if (row && (index || index === 0)) {
                { /* pagination.value.pageSizes![index] = sizeForm.value */ }
                pagination.value.pageSizes?.splice(index, 1, sizeForm.value)
              }
              pagination.value.pageSizes?.sort((a, b) => a.size - b.size)
              close()
            }}>
      <FormKitSchema schema={bgConfigSchema} ></FormKitSchema>
    </FormKit>,
    footer: () => [
      <n-button onClick={() => {
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
    <FormKit v-model="pagination" type="form" :actions="false" :incomplete-message="false">
      <FormKitSchema :schema :data :library />
    </FormKit>
  </div>
</template>
