<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import { NSpace } from 'naive-ui'
import { isArray } from 'lodash-es'
import { defineModal } from '@runafe/magic-system'
import type { Column, HeaderColumn } from '@runafe/unified-api-designer'
import { TableHeaderType } from '@runafe/unified-api-designer'
import { FormKit, FormKitSchema } from '@formkit/vue'
import type { FormKitSchemaDefinition } from '@formkit/core'
import { useColumnCondition } from './ColumnCondition'

defineExpose({ name: 'RsHeaderTree' })

function createLabel(level: number): string {
  if (level === 4) {
    return '道生一'
  }
  if (level === 3) {
    return '一生二'
  }
  if (level === 2) {
    return '二生三'
  }
  if (level === 1) {
    return '三生万物'
  }
  return ''
}

const modal = defineModal({
  width: 300,
})
const columnCondition = useColumnCondition()
const tableHeaderType = ref([{ label: '分组', value: TableHeaderType.GROUP }, {
  label: '列',
  value: TableHeaderType.COLUMN,
}])
const selectType = ref<TableHeaderType>(TableHeaderType.GROUP)
const treeData = ref(createData())
const gropSchema: FormKitSchemaDefinition = [
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
  labelWidth: 70,
})

function updateNode(tree, newNode, key?: string, operation?: string) {
  // 递归函数，用于在树中查找和更新节点
  function traverseAndUpdate(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i]
      if (currentNode[key] === newNode[key]) {
        // 如果找到匹配的节点，则更新它
        if (operation === 'add') {
          currentNode.children = currentNode.children || [] // 确保children数组存在
          currentNode.children.push(newNode)
        }
        else if (operation === 'delete') {
          nodes.splice(i, 1)
        }
        else {
          Object.assign(currentNode, newNode)
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

function add(row) {
  if (!isArray(row.option.children)) {
    row.option.children = [{
      label: 'Node 2',
      key: (Math.random() * 1000).toFixed(3),
      children: [],
    }]
  }
  else {
    row.option.children = [...row.option.children, {
      label: 'Node 2',
      key: (Math.random() * 1000).toFixed(3),
      children: [],
    }]
  }
}

function edit({ option }) {
  option.label = '1111'
  updateNode(treeData.value, option, 'key', 'edit')
}

function del({ option }: { option: TreeOption }) {
  updateNode(treeData.value, option, 'key', 'delete')
}

function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level) {
    return undefined
  }
  return [1, 2, 3, 4, 5].map((_, index) => {
    const key = `${baseKey}${level}${index}`
    const label = createLabel(level)
    return {
      label,
      key,
      children: createData(level - 1, key),
    }
  })
}

function renderSuffix(row) {
  return (<NSpace>
    <n-button quaternary size="tiny" onClick={() => {
      addHeader({ row })
    }}>
      <svg-icon icon="icon-park-outline:add" class="text-16px"/>
    </n-button>
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
    if (siblingNode.key === node.key) { return [nodes, i] }
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

function addHeader({ row }: { row?: Column | HeaderColumn }) {
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
            columnCondition.use({
              columns: [
                { name: 'name', label: '姓名', matcher: '', visible: true },
                { name: 'age', label: '年龄', matcher: '', visible: true },
                { name: 'sex', label: '性别', matcher: '', visible: true },
              ],
              save(data) {
                console.log(data)
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
    title: () => '添加表头',
    default: () => (<FormKit type="form"
                             v-model={gropForm.value}
                             actions={false}
                             incomplete-message={false}
                             config={config}
                             onSubmit={() => {

                             }}>
        <FormKitSchema schema={gropSchema}></FormKitSchema>
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

        }}
      >
        确定
      </n-button>,
    ],
  })
  if (!row) {
    modal.openAt(0)
  }
  else {
    if (row.type === TableHeaderType.GROUP) {
      modal.openAt(1)
    }
    else {
      columnCondition.use({
        columns: [
          { name: 'name', label: '姓名', matcher: '', visible: true },
          { name: 'age', label: '年龄', matcher: '', visible: true },
          { name: 'sex', label: '性别', matcher: '', visible: true },
        ],
        save(data) {
          console.log(data)
        },
      })
    }
  }
}
</script>

<template>
  <div>
    <n-button class="w-full" @click="addHeader">
      <template #icon>
        <SvgIcon icon="carbon:add" class="inline-block align-text-bottom text-20px" />
      </template>
      添加表头分组
    </n-button>
    <n-tree
      block-line
      draggable
      :data="treeData"
      key-field="key"
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
