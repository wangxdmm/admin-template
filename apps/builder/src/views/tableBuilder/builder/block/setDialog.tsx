import { defineModal } from '@runafe/magic-system'
import { FormKit, FormKitSchema } from '@formkit/vue'
import { getNode } from '@formkit/core'
import { CriteriaMatcher } from '@runafe/unified-api-designer'
import type { AdvancedQueryField, GeneralQueryField, QuerySingleCriteria } from '@runafe/unified-api-designer'
import { viewModelFields } from '../viewModels'

export function useSetDialog() {
  const modal = defineModal({
    width: 500,
  })
  function open<T extends GeneralQueryField | AdvancedQueryField>(options: {
    type: number
    row: T
    set: (row: T) => void
  }) {
    const matcherList: QuerySingleCriteria[] = [{ fieldName: '等于空', matcher: CriteriaMatcher.ISNULL }, { fieldName: '不等于空', matcher: CriteriaMatcher.NOT_NULL }, {
      fieldName: '等于',
      matcher: CriteriaMatcher.EQ,
    }, { fieldName: '不等于', matcher: CriteriaMatcher.NOT_EQ }, { fieldName: '大于', matcher: CriteriaMatcher.GT }, { fieldName: '大于等于', matcher: CriteriaMatcher.GE }, {
      fieldName: '小于',
      matcher: CriteriaMatcher.LT,
    }, { fieldName: '小于等于', matcher: CriteriaMatcher.LE }, { fieldName: '包含', matcher: CriteriaMatcher.LIKE }, { fieldName: '不包含', matcher: CriteriaMatcher.NOT_LIKE }, { fieldName: '开始于', matcher: CriteriaMatcher.PREFIX_LIKE }, {
      fieldName: '结束于',
      matcher: CriteriaMatcher.SUFFIX_LIKE,
    }, { fieldName: '介于', matcher: CriteriaMatcher.BETWEEN }, { fieldName: '不介于', matcher: CriteriaMatcher.NOT_BETWEEN }, { fieldName: '存在于', matcher: CriteriaMatcher.IN }, { fieldName: '不存在于', matcher: CriteriaMatcher.NOT_IN }]
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
        valueField: '',
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
        getNode(argumentsKey)?.input(options.row[argumentsKey],
        )
      }
    }
    setTimeout(() => {
      init()
    })
    function submit() {
      const values = getNode('FormKitRef')?.value
      if (options.set) {
        options.set(values)
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
