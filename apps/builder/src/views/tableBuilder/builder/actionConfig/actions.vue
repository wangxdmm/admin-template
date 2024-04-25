<script lang="tsx" setup>
import type { UnifiedAction } from '@runafe/unified-api-designer'
import { defineModal } from '@runafe/magic-system'
import type { FormKitNode } from '@formkit/core'
import { FormKit, FormKitSchema } from '@formkit/vue'
import { titleClass } from '../share'
import RnConditions from '../block/condition.vue'
import { schema } from './schema'

const props = defineProps<{
  title: string
  modelValue: UnifiedAction[]
}>()

const actions = defineModel<UnifiedAction[]>()

const { load, close } = defineModal({ width: 600 })

function add() {
  const formValue = ref<UnifiedAction>({} as UnifiedAction)
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
              actions.value?.push(formValue.value)
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
    <RnConditions v-model="actions" :button-name="`添加${props.title}`" @add="add" />
  </div>
</template>
