<script lang="tsx" setup>
import type { ActionConfig } from '@runafe/unified-api-designer'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { tableSchema } from '../tableSchema'
import { titleClass } from '../share'

const userCustom = computed<ActionConfig['userCustom']>({
  get: () => tableSchema.value.actionConfig?.userCustom || {},
  set: (val) => {
    tableSchema.value.actionConfig!.userCustom = val
  },
})

const data = {
  titleClass,
}

const schema: FormKitSchemaDefinition = [
  {
    $el: 'p',
    children: '用户自定义',
    attrs: {
      class: '$titleClass',
    },
  },
  {
    $formkit: 'n:switch',
    name: 'enabled',
    label: '是否启用',
  },

]
</script>

<template>
  <div>
    <FormKit v-model="userCustom" type="form" :actions="false" :incomplete-message="false">
      <FormKitSchema :schema :data />
    </FormKit>
  </div>
</template>
