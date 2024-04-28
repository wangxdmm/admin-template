<script setup lang="tsx">
import { computed, reactive, ref } from 'vue'
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import { NSpace, useMessage } from 'naive-ui'
import { defineModal } from '@runafe/magic-system'
import type { Field, HeaderColumn } from '@runafe/unified-api-designer'
import { TableHeaderType } from '@runafe/unified-api-designer'
import { FormKit, FormKitSchema } from '@formkit/vue'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { getNode } from '@formkit/core'
import { defaultColumn, tableSchema } from '../tableSchema'
import { useColumnDialog } from './columnDialog'
import { useColumnCondition } from './ColumnCondition'
import { traverseTree } from ':/utils/treeFunction'

defineExpose({ name: 'RsHeaderTree' })
const message = useMessage()
const columnDialog = useColumnDialog()
const modal = defineModal({
  width: 300,
})
const columnCondition = useColumnCondition()
const tableHeaderType = ref([{ label: '分组', value: TableHeaderType.GROUP }, {
  label: '列',
  value: TableHeaderType.COLUMN,
}])
const selectType = ref<TableHeaderType>(TableHeaderType.GROUP)
const treeData = computed({
  get: () => tableSchema.value.headerColumns || [],
  set: (val: HeaderColumn[]) => {
    tableSchema.value.headerColumns = val
  },
})
const isAddGroup = ref<number>(1)
const selectColumn = computed<Field[]>(() => {
  const names = tableSchema.value.columns.map(v => v.name)
  return (tableSchema.value.fields ?? []).filter(item => !names.includes(item.name))
})
const gropSchema: FormKitSchemaDefinition = [
  {
    $formkit: 'n:text',
    name: 'name',
    label: '唯一标识',
    disabled: '$isName',
    validation: 'required',
  },
  {
    $formkit: 'n:text',
    name: 'label',
    label: '显示名',
    validation: 'required',
  },
]
const gropForm = ref()
const config = reactive({
  labelPlacement: 'left',
  labelAlign: 'right',
  labelWidth: 80,
})
const groupData = reactive({
  isName: computed(() => isAddGroup.value === 3),
})
function updateNode(tree, newNode: TreeOption, key: string, operation?: string, keyNode?: string) {
  // 递归函数，用于在树中查找和更新节点
  function traverseAndUpdate(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i]
      const nodeId: string = keyNode || newNode[key]
      if (currentNode[key] === nodeId) {
        // 如果找到匹配的节点，则更新它
        if (operation === 'add') {
          currentNode.children = currentNode.children || [] // 确保children数组存在
          currentNode.children.push(newNode)
        }
        else if (operation === 'delete') {
          nodes.splice(i, 1)
        }
        else {
          nodes = Object.assign(currentNode, newNode)
        }
        return // 更新后退出循环
      }
      if (currentNode.children) {
        // 递归检查子节点
        traverseAndUpdate(currentNode.children)
      }
    }
  }
  traverseAndUpdate(tree)
}

function edit(row: { option: TreeOption }) {
  isAddGroup.value = 3
  addHeader(row)
}
function addGroup() {
  isAddGroup.value = 1
  addHeader({})
}
function del({ option }: { option: TreeOption }) {
  updateNode(treeData.value, option, 'name', 'delete')
}
function renderSuffix(row) {
  return (<NSpace>
    {
      row.option.type === 'GROUP'
        ? <n-button quaternary size="tiny" onClick={() => {
          isAddGroup.value = 2
          addHeader(row)
        }}>
      <svg-icon icon="icon-park-outline:add" class="text-16px"/>
    </n-button>
        : null
    }
    <n-button quaternary size="tiny" onClick={() => {
      edit(row)
    }}>
      <svg-icon icon="lucide:edit" class="text-16px"/>
    </n-button>
    <n-button quaternary size="tiny" onClick={() => {
      del(row)
    }}>
      <svg-icon icon="material-symbols:delete-outline" class="text-16px"/>
    </n-button>
  </NSpace>)
}

function renderPrefix({ option }: { option: TreeOption }) {
  return (<svg-icon icon="radix-icons:file-text" class="text-16px"/>)
}

function findSiblingsAndIndex(
  node: TreeOption,
  nodes?: TreeOption[],
): [TreeOption[], number] | [null, null] {
  if (!nodes) { return [null, null] }
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i]
    if (siblingNode.name === node.name) { return [nodes, i] }
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
    if (siblings && index !== null) { return [siblings, index] }
  }
  return [null, null]
}

function handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
    dragNode,
    treeData.value,
  )
  if (dragNodeSiblings === null || dragNodeIndex === null) { return }
  dragNodeSiblings.splice(dragNodeIndex, 1)
  if (dropPosition === 'inside') {
    if (node.children) {
      node.children.unshift(dragNode)
    }
    else {
      node.children = [dragNode]
    }
  }
  else if (dropPosition === 'before') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
      node,
      treeData.value,
    )
    if (nodeSiblings === null || nodeIndex === null) { return }
    nodeSiblings.splice(nodeIndex, 0, dragNode)
  }
  else if (dropPosition === 'after') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
      node,
      treeData.value,
    )
    if (nodeSiblings === null || nodeIndex === null) { return }
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
  }
  treeData.value = Array.from(treeData.value)
}
const selectOption = ref<TreeOption>({})
function addHeader({ option }: { option: TreeOption }) {
  selectOption.value = { ...option }
  selectType.value = TableHeaderType.GROUP
  modal.load({
    title: () => '选择表头类型',
    default: () => (<n-space>
        <span>类型</span>
        <n-select v-model:value={selectType.value} options={tableHeaderType.value}/>
      </n-space>
    ),
    footer: () => [
      <n-button onClick={() => {
        modal.closeAt(0)
      }}
      >
        关闭
      </n-button>,
      <n-button
        type="primary"
        onClick={() => {
          if (selectType.value === TableHeaderType.GROUP) {
            modal.openAt(1)
          }
          else {
            if (selectColumn.value.length === 0) {
              return message.warning('请设置表格列')
            }
            const columns = selectColumn.value.filter((c) => {
              if (!traverseTree(treeData.value, 'name').includes(c.name)) {
                c.selectable = false
                return true
              }
              else {
                return false
              }
            })
            if (columns.length === 0) {
              return message.warning('没有可用配置列')
            }
            columnCondition.use({
              title: '添加表头分组',
              columns,
              save(data) {
                const selects = data.filter(v => v.selectable).map(item => ({ ...item, ...defaultColumn }))
                if (selects.length) {
                  if (isAddGroup.value === 1) {
                    treeData.value.push(...selects)
                  }
                  else {
                    selects.forEach((v) => {
                      updateNode(treeData.value, v, 'name', 'add', selectOption.value.name)
                    })
                  }
                  modal.closeAt(1)
                  modal.closeAt(0)
                }
              },
            })
          }
        }}
      >
        确定
      </n-button>,
    ],
  }).spawn({
    width: 400,
  }).load({
    title: () => isAddGroup.value === 3 ? '修改表头' : '添加表头',
    default: () => (<FormKit type="form" id="groupForm"
                             v-model={gropForm.value}
                             actions={false}
                             incomplete-message={false}
                             config={config}
                             onSubmit={(val) => {
                               if (isAddGroup.value === 1) {
                                 treeData.value?.push({ ...val, type: selectType.value, children: [] })
                               }
                               else if (isAddGroup.value === 2) {
                                 updateNode(treeData.value, { ...val, type: selectType.value, children: [] }, 'name', 'add', selectOption.value.name)
                               }
                               else {
                                 updateNode(treeData.value, val, 'name', 'edit')
                               }
                               modal.closeAt(1)
                               modal.closeAt(0)
                             }}>
        <FormKitSchema schema={gropSchema} data={groupData}></FormKitSchema>
      </FormKit>
    ),
    footer: () => [
      <n-button onClick={() => {
        modal.closeAt(1)
      }}
      >
        关闭
      </n-button>,
      <n-button
        type="primary"
        onClick={() => {
          getNode('groupForm')?.submit()
        }}
      >
        确定
      </n-button>,
    ],
  })
  if (isAddGroup.value === 1 || isAddGroup.value === 2) {
    modal.openAt(0)
    gropForm.value = {
      name: '',
      label: '',
    }
  }
  else {
    if (selectOption.value.type === TableHeaderType.GROUP) {
      modal.openAt(1)
      for (const key in selectOption.value) {
        gropForm.value[key] = selectOption.value[key]
      }
    }
    else {
      columnDialog.open({
        row: selectOption.value,
        set(data) {
          updateNode(treeData.value, { ...selectOption.value, ...data }, 'name', 'edit')
        },
      })
    }
  }
}
</script>

<template>
  <div>
    <n-button class="w-full" @click="addGroup">
      <template #icon>
        <SvgIcon icon="carbon:add" class="inline-block align-text-bottom text-20px" />
      </template>
      添加表头分组
    </n-button>
    <n-tree
      block-line
      draggable
      :data="treeData"
      key-field="name"
      :show-line="true"
      :render-suffix="renderSuffix"
      :render-prefix="renderPrefix"
      :selectable="false"
      @drop="handleDrop"
    />
  </div>
</template>

<style scoped>

</style>
