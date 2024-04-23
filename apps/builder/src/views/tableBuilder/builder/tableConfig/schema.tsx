import type { FormKitSchemaDefinition } from '@formkit/core'

export const schema: FormKitSchemaDefinition = [
  {
    $formkit: 'form',
    id: 'dataSource',
    actions: false,
    incompleteMessage: false,
    modelValue: '$tableConfig.dataSource',
    children: [
      {
        $el: 'p',
        children: '数据源',
        attrs: {
          class: '$titleClass',
        },
      },
      {
        $formkit: 'n:select',
        name: 'viewModelCode',
        label: '视图编号',
        validation: 'required',
        options: '$options.viewModel',
      },
      {
        $formkit: 'n:text',
        name: 'serverName',
        label: '服务名',
      },
      {
        $formkit: 'n:text',
        name: 'filter',
        label: '数据范围',
      },
    //   {
    //     $formkit: 'n:switch',
    //     name: 'loadOnInit',
    //     label: '是否启用初始加载数据',
    //   },
    ],
  },
  {
    $formkit: 'form',
    id: 'styleConfig',
    actions: false,
    incompleteMessage: false,
    modelValue: '$tableConfig.styleConfig',
    children: [
      {
        $el: 'p',
        children: '样式',
        attrs: {
          class: '$titleClass',
        },
      },
      //   {
      //     $formkit: 'n:switch',
      //     name: 'bordered',
      //     label: '启用边框',
      //   },
      //   {
      //     $formkit: 'n:switch',
      //     name: 'stripe',
      //     label: '启用斑马线',
      //   },
      {
        $formkit: 'n:select',
        name: 'viewModelCode',
        label: '视图编号',
        validation: 'required',
        options: '$options.viewModel',
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
        $formkit: 'n:text',
        name: 'filter',
        label: '数据范围',
      },
    //   {
    //     $formkit: 'n:switch',
    //     name: 'loadOnInit',
    //     label: '是否启用初始加载数据',
    //   },
    ],
  },
]
