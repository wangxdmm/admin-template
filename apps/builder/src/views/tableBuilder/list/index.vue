<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineDataTable } from '@runafe/magic-system'
import { NButton, NPopconfirm, NSpace, useDialog } from 'naive-ui'
import dayjs from 'dayjs'
import { useEditDialog } from './editDialog'
import type { TableEntitySearch, viewModelEntity } from ':/typings/designer'
import { designerDoApplication } from ':/api'
import { RCriterias, RQuery } from ':/utils/query/index'

const schema = [
  {
    $formkit: 'n:text',
    name: 'name',
    label: '显示名',
  },
  {
    $formkit: 'n:select',
    name: 'code',
    label: '视图编号',
    id: 'appCode',
    valueField: 'code',
    labelField: 'name',
    options: '$viewList',
  },
]
const defaultValue = ref({})
const formData = reactive<{
  viewList: TableEntitySearch[]
}>({
  viewList: [],
})
const editDialog = useEditDialog()
const rsDialog = useDialog()
const router = useRouter()
const columns = [
  {
    field: 'code',
    title: '视图编号',
    align: 'center',
    width: 360,
    sortable: false,
  },
  {
    field: 'name',
    title: '显示名',
    align: 'center',
    width: 200,
    sortable: false,
  },
  {
    field: 'desc',
    title: '描述',
    align: 'center',
    width: 300,
    sortable: false,
  },
  {
    field: 'createdBy',
    title: '操作人',
    align: 'center',
    width: 100,
    sortable: false,
  },
  {
    field: 'createdAt',
    title: '操作时间',
    align: 'center',
    width: 200,
    sortable: false,
    slots: {
      default: ({ row }: { row: viewModelEntity }) => {
        return row.createdAt
          ? dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : null
      },
    },
  },
  {
    field: 'operat',
    title: '操作',
    align: 'center',
    width: 190,
    fixed: 'right',
    slots: {
      default: ({ row }: { row: viewModelEntity }) => {
        return (
          <NSpace>
            <NButton
              text
              type="primary"
              onClick={() => operationHandle(row, 1)}
            >
              编辑表格
            </NButton>
            <NButton
              text
              type="primary"
              onClick={() => operationHandle(row, 2)}
            >
              设计页面
            </NButton>
            <NPopconfirm onPositiveClick={() => operationHandle(row, 3)}>
              {{
                trigger: () => (
                  <NButton text type="error">
                    删除
                  </NButton>
                ),
                default: () => '确认是否删除？',
              }}
            </NPopconfirm>
          </NSpace>
        )
      },
    },
  },
]
const Table = defineDataTable<viewModelEntity>(columns as TODO, {
  immediate: true,
  checkedOnClick: true,
  getData: async (params, ctx) => {
    const { pageIndex, pageSize } = params
    const query = RQuery.of(
      RCriterias.must(RCriterias.eq('appCode', 'CHARGE'))
        .must(RCriterias.eq('name', defaultValue.value.name ?? null))
        .must(RCriterias.eq('code', defaultValue.value.code ?? null)),
      [],
      pageIndex,
      pageSize,
    )
    const { wholeData } = await designerDoApplication.search(query)()
    if (wholeData) {
      ctx.setData(wholeData.data)
      return [
        {
          total: wholeData.total,
        },
      ]
    }
  },
})

function operationHandle(row: viewModelEntity, type: number) {
  // 编辑表格
  if (type === 1) {
    editDialog.open({
      row,
      type,
      reload() {
        refreshTable()
      },
    })
  }
  if (type === 2) {
    router.push({ path: '/tableBuilder/builder', query: { code: row.code } })
  }
  // 删除数据
  if (type === 3) {
    deleteData(row.code)
  }
}

async function deleteData(code: string) {
  const { result, message } = await designerDoApplication.deleteAndRelease({
    code,
  })()
  if (result) {
    rsDialog.success(message)
    refreshTable()
  }
}

function search() {
  Table.context.setPagerConfig({
    pageIndex: 1,
  })
  refreshTable()
}

function refreshTable() {
  Table.context.refresh()
}

function add() {
  editDialog.open({
    type: 0,
    reload: () => {
      refreshTable()
    },
  })
}

async function loadView() {
  const query = RQuery.of(
    RCriterias.must(RCriterias.eq('appCode', 'CHARGE')),
    [],
  )
  const { wholeData } = await designerDoApplication.viewSearch(query)()
  if (wholeData) {
    formData.viewList = wholeData.data as TableEntitySearch[]
  }
}
onMounted(() => {
  loadView()
})
</script>

<template>
  <rs-page>
    <rs-content>
      <template #top>
        <rs-search
          v-model="defaultValue"
          :schema="schema"
          :data="formData"
          @search="search"
        >
          <template #operator>
            <NButton type="primary" @click="add">
              新增表格
            </NButton>
          </template>
        </rs-search>
      </template>
      <template #default="{ height }">
        <Table.Component :height />
      </template>
    </rs-content>
  </rs-page>
</template>

<style scoped></style>
