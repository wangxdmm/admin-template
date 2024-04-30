import type { FormKitSchemaDefinition } from '@formkit/core'

export const schema: FormKitSchemaDefinition = [
  {
    $formkit: 'n:text',
    name: 'name',
    label: '唯一标识',
    maxlength: 50,
    validation: [['required'], ['matches', '/^[a-zA-Z0-9_]+$/']],
  },
  {
    $formkit: 'n:text',
    name: 'label',
    label: '显示名',
    validation: 'required',
    maxlength: 10,
  },
  {
    $formkit: 'n:text',
    name: 'description',
    label: '描述',
    maxlength: 500,
  },
  {
    $formkit: 'n:text',
    name: 'color',
    label: '颜色',
  },
  {
    $formkit: 'n:text',
    name: 'command',
    label: '操作指令',
  },

]
