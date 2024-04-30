<script lang="tsx" setup>
import type { UnifiedAction } from '@runafe/unified-api-designer'
import { defineModal } from '@runafe/magic-system'
import type { FormKitNode } from '@formkit/core'
import { FormKit, FormKitSchema } from '@formkit/vue'
import { useMessage } from 'naive-ui'
import { titleClass } from '../share'
import RnConditions from '../block/condition.vue'
import { schema } from './schema'

const props = defineProps<{
  title: string
  modelValue: UnifiedAction[]
}>()

const message = useMessage()

const actions = ref<UnifiedAction[]>(props.modelValue || [])

const { load, close } = defineModal({ width: 600 })

function edit(row?: UnifiedAction, index?: number) {
  const formValue = ref<UnifiedAction>(row || {} as UnifiedAction)
  let formNode: FormKitNode
  load({
    title: () => props.title,
    default: () => <FormKit type="form"
            v-model={formValue.value}
            onNode={(n: FormKitNode) => {
              formNode = n
            }}
            actions={false}
            incomplete-message={false}
            onSubmit={() => {
              if (row && (index || index === 0)) {
                actions.value?.splice(index, 1, formValue.value)
              }
              else {
                actions.value?.push(formValue.value)
              }
              close()
            }}>
      <FormKitSchema schema={schema} ></FormKitSchema>
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
          if (actions.value?.find(item => item.name === formValue.value.name)) {
            return message.error('该唯一标识已存在')
          }
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
  <div class="m-b-20px">
    <p :class="titleClass">
      {{ props.title }}
    </p>
    <RnConditions v-model="actions" name-field="name" :button-name="`添加${props.title}`" @add="edit" @update="edit" />
  </div>
</template>
