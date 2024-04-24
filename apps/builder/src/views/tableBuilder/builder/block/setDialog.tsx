import {defineModal} from '@runafe/magic-system'
import {FormKit, FormKitSchema} from "@formkit/vue";
import {getNode} from "@formkit/core";
import type {GeneralQueryField, AdvancedQueryField} from '@runafe/unified-api-designer'

export function useSetDialog() {
  const modal = defineModal({
    width: 500,
  })

  function open(options: {
    type: number,
    row: GeneralQueryField | AdvancedQueryField,
    set: (row: GeneralQueryField | AdvancedQueryField) => void
  }) {
    const userSchema = ref([
      {
        $formkit: 'n:text',
        name: 'name',
        id: 'name',
        label: '唯一标识',
        maxlength: 50,
        validation: [['required'], ['matches', '/^[a-zA-Z0-9_]+$/']],
        validationMessages: {matches: '请输入正确的唯一标识'}
      },
      {
        $formkit: 'n:text',
        name: 'label',
        id: 'label',
        label: '显示名',
        maxlength: 10
      },
      {
        $formkit: 'n:select',
        name: 'matcher',
        id: 'matcher',
        label: '匹配方式',
        options: '$matcherList'
      },
      {
        $formkit: 'n:textarea',
        name: 'inputComponent',
        id: 'inputComponent',
        if: '$ishow',
        label: '输入组件',
        maxlength: 500
      },
      {
        $formkit: 'n:text',
        name: 'defaultValue',
        id: 'defaultValue',
        if: '$ishow',
        label: '默认值'
      }
    ])
    const config = reactive({
      validationVisibility: 'dirty',
      outerClass: 'half',
      labelPlacement: 'left',
      labelAlign: 'right',
      labelWidth: 80,
      size: 'small',
    })
    const checkForm = reactive({
      ishow: options.type === 1,
      matcherList: [{label: '等于空', value: 'ISNULL'}, {label: '不等于空', value: 'NOT_NULL'}, {
        label: '等于',
        value: 'EQ'
      }, {label: '不等于', value: 'NOT_EQ'},
        {label: '大于', value: 'GT'}, {label: '大于等于', value: 'GE'}, {
          label: '小于',
          value: 'LT'
        }, {label: '小于等于', value: 'LE'}, {label: '包含', value: 'LIKE'},
        {label: '不包含', value: 'NOT_LIKE'}, {label: '开始于', value: 'PREFIX_LIKE'}, {
          label: '结束于',
          value: 'SUFFIX_LIKE'
        }, {label: '介于', value: 'BETWEEN'},
        {label: '不介于', value: 'NOT_BETWEEN'}, {label: '存在于', value: 'IN'}, {label: '不存在于', value: 'NOT_IN'}]
    })

    function init() {
      for (const argumentsKey in options.row) {
        getNode(argumentsKey)?.input(options.row[argumentsKey]
        )
      }
    }
    setTimeout(()=>{
      init()
    })
    function submit() {
      const values = getNode('FormKitRef')?.value;
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
    open
  }
}
