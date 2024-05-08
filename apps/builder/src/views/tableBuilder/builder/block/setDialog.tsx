import { defineModal } from '@runafe/magic-system'
import { FormKit, FormKitSchema } from '@formkit/vue'
import { getNode } from '@formkit/core'

import type { AdvancedQueryField, GeneralQueryField } from '@runafe/unified-api-designer'
import { omit } from 'lodash-es'
import { viewModelFields } from '../viewModels'
import { matcherList } from './common'

export function useSetDialog() {
  const modal = defineModal({
    width: 500,
  })
  function open<T extends GeneralQueryField | AdvancedQueryField>(options: {
    type: number
    row: T
    set: (row: T) => void
  }) {
    const checkForm = reactive({
      ishow: options.type === 1,
      isMultiple: options.type !== 1,
      matcherList: matcherList.filter(v => viewModelFields.value.find(c => c.name === options.row.name)?.supportMatchers.includes(v.matcher)),
    })
    const userSchema = ref([
      {
        $formkit: 'n:text',
        name: 'name',
        id: 'name',
        label: '唯一标识',
        disabled: true,
        maxlength: 50,
        validation: [['required'], ['matches', '/^[a-zA-Z0-9_]+$/']],
        validationMessages: { matches: '请输入正确的唯一标识' },
      },
      {
        $formkit: 'n:text',
        name: 'label',
        id: 'label',
        label: '显示名',
        maxlength: 10,
      },
      {
        $formkit: 'n:select',
        name: 'matcher',
        id: 'matcher',
        label: '匹配方式',
        multiple: '$isMultiple',
        labelField: 'fieldName',
        valueField: 'matcher',
        options: '$matcherList',
        validation: [['required']],
        validationMessages: { required: '必填' },
      },
      {
        $formkit: 'n:textarea',
        name: 'inputComponent',
        id: 'inputComponent',
        if: '$ishow',
        label: '输入组件',
        maxlength: 500,
      },
      {
        $formkit: 'n:text',
        name: 'defaultValue',
        id: 'defaultValue',
        if: '$ishow',
        label: '默认值',
      },
    ])
    const config = reactive({
      validationVisibility: 'dirty',
      outerClass: 'half',
      labelPlacement: 'left',
      labelAlign: 'right',
      labelWidth: 80,
      size: 'small',
    })
    function init() {
      for (const argumentsKey in options.row) {
        if (argumentsKey === 'matchers') {
          getNode('matcher')?.input(options.row[argumentsKey])
        }
        getNode(argumentsKey)?.input(options.row[argumentsKey])
      }
    }
    setTimeout(() => {
      init()
    })
    function submit() {
      const values = getNode('FormKitRef')?.value
      if (options.set) {
        const obj = options.type === 1 ? values : { matchers: values.matcher, ...omit(values, ['matcher']) }
        options.set(obj)
      }
      modal.close()
    }

    function submitHandle() {
      getNode('FormKitRef')?.submit()
    }

    modal.load({
      title: () => options.type === 1 ? '查询条件设置' : '筛查条件设置',
      default: () => [<FormKit
        id='FormKitRef'
        config={config}
        type="form"
        actions={false}
        incompleteMessage={false}
        onSubmit={submit}
      >
        <FormKitSchema schema={userSchema.value} data={checkForm}/>
      </FormKit>],
      footer: () => [
        <n-button
          onClick={() => {
            modal.close()
          }}
        >
          关 闭
        </n-button>,
        <n-button type="primary" onClick={submitHandle}>
          确 定
        </n-button>,
      ],
    }).open()
  }

  return {
    open,
  }
}
