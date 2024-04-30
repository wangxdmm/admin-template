import { defineModal } from '@runafe/magic-system'
import { FormKit, FormKitSchema } from '@formkit/vue'
import { getNode } from '@formkit/core'
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import type { TableSchema } from '@runafe/unified-api-designer'
import { RCriterias, RQuery } from ':/utils/query'
import { designerDoApplication } from ':/api'
import type { TableEntitySearch, ViewModelEntity } from ':/typings/designer'

export function useEditDialog() {
  const editDialog = useMessage()
  const modal = defineModal({
    width: 500,
  })

  function open(options: {
    row?: ViewModelEntity
    type: number
    reload: () => void
  }) {
    loadView()
    const userSchema = ref([
      {
        $formkit: 'n:select',
        name: 'appCode',
        label: '所属应用',
        id: 'appCode',
        disabled: options.type === 1,
        options: [{ label: '收费系统', value: 'CHARGE' }],
        validation: [['required']],
        validationMessages: { required: '必填' },
      },
      {
        $formkit: 'n:select',
        name: 'code',
        id: 'code',
        label: '关联视图',
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
        label: '表格名称',
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
      viewList: TableEntitySearch[]
    }>({
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
    function submit() {
      const values = getNode('FormKitRef')?.value as ViewModelEntity
      const checkView = checkForm.viewList.find(v => v.code === values.code) as ViewModelEntity

      const param = { dataSource: {
        viewModelCode: values.code,
        viewTitle: checkView.name,
        serverName: checkView.serverId,
      }, ...values, code: options.type === 1 ? options.row?.code : `${values.appCode}-${new Date().getTime()}-TABLEENTITY` } as unknown as TableSchema
      if (options.type === 1) {
        save(param)
      }
      else {
        add(param)
      }
    }
    async function add(param: TableSchema) {
      const { result, message }
      = await designerDoApplication.add(param)()
      if (result) {
        modal.close()
        editDialog.success(message ?? '')
        if (options.reload) {
          options.reload()
        }
      }
    }
    async function save(param: TableSchema) {
      const { result, message }
      = await designerDoApplication.save(param)()
      if (result) {
        modal.close()
        editDialog.success(message ?? '')
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
            if (argumentsKey === 'code') {
              node.input(options.row?.dataSource.viewModelCode)
            }
            else {
              node.input(options.row[argumentsKey as keyof ViewModelEntity])
            }
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
