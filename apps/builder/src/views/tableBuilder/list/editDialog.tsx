import { defineModal } from '@runafe/magic-system'
import { FormKit, FormKitSchema } from '@formkit/vue'
import { getNode } from '@formkit/core'
import { ref } from 'vue'
import { useDialog } from 'naive-ui'
import type { viewModelEntity, TableEntitySearch } from ':/typings/designer'
import { designerDoApplication } from ':/api'
import { RCriterias, RQuery } from ':/utils/query'

const editDialog = useDialog()

export function useEditDialog() {
  const modal = defineModal({
    width: 500,
  })

  function open(options: {
    row?: viewModelEntity
    type: number
    reload: () => void
  }) {
    loadView()
    const userSchema = ref([
      {
        $formkit: 'n:select',
        name: 'appCode',
        label: '应用编号',
        id: 'appCode',
        options: [{ label: '收费系统', value: 'CHARGE' }],
        validation: [['required']],
        validationMessages: { required: '必填' },
      },
      {
        $formkit: 'n:select',
        name: 'code',
        id: 'code',
        label: '视图编号',
        disabled: '$editable',
        labelField: 'name',
        valueField: 'code',
        options: '$viewList',
        validation: [['required']],
        validationMessages: { required: '必填' },
      },
      {
        $formkit: 'n:text',
        name: 'name',
        id: 'name',
        label: '显示名',
        maxlength: 10,
      },
      {
        $formkit: 'n:textarea',
        name: 'desc',
        id: 'desc',
        label: '描述',
        maxlength: 500,
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
    const checkForm = reactive<{
      editable: boolean
      viewList: TableEntitySearch[]
    }>({
      editable: options.type === 1,
      viewList: [],
    })
    async function loadView() {
      const query = RQuery.of(
        RCriterias.must(RCriterias.eq('appCode', 'CHARGE')),
        [],
      )
      const { wholeData } = await designerDoApplication.viewSearch(query)()
      if (wholeData) {
        checkForm.viewList = wholeData.data as TableEntitySearch[]
      }
    }
    loadView()
    async function submit() {
      const values = getNode('FormKitRef')?.value
      const { result, message }
        = await designerDoApplication.saveAndRelease(values)()
      if (result) {
        modal.close()
        editDialog.success(message)
        if (options.reload) {
          options.reload()
        }
      }
    }
    setTimeout(() => {
      if (options.row && Object.keys(options.row).length) {
        for (const argumentsKey in options.row) {
          const node = getNode(argumentsKey)
          if (node) {
            node.input(options.row[argumentsKey])
          }
        }
      }
    })
    function submitHandle() {
      getNode('FormKitRef')?.submit()
    }
    modal
      .load({
        title: () => (options.type === 1 ? '编辑表格' : '新增表格'),
        default: () => [
          <FormKit
            id="FormKitRef"
            config={config}
            type="form"
            actions={false}
            incompleteMessage={false}
            onSubmit={submit}
          >
            <FormKitSchema schema={userSchema.value} data={checkForm} />
          </FormKit>,
        ],
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
      })
      .open()
  }

  return {
    open,
  }
}
