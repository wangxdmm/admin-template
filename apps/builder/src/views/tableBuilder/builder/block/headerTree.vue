<script setup lang="tsx">
import {NSpace, TreeOption} from "naive-ui";
import {isArray} from "lodash-es";

defineExpose({name: 'RsHeaderTree'})

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

function add(row) {
  if (!isArray(row.option.children)) {
    row.option.children = [{
      label: 'Node 2',
      key: (Math.random()*1000).toFixed(3),
      children: []
    }]
  } else {
    row.option.children = [...row.option.children, {
      label: 'Node 2',
      key: (Math.random()*1000).toFixed(3),
      children: []
    }]
  }
}

function edit(row) {
  row.option.label = '1111'
}

function del({option}: { option: TreeOption }) {
}

function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined
  return [1, 2, 3, 4, 5].map((_, index) => {
    const key = '' + baseKey + level + index
    const label = createLabel(level)
    return {
      label,
      key,
      children: createData(level - 1, key)
    }
  })
}

function renderSuffix(row) {
  return (<NSpace>
    <n-button quaternary size="tiny" onClick={() => {
      add(row)
    }}>
      <SvgIcon icon="icon-park-outline:add" class="text-16px"/>
    </n-button>
    <n-button quaternary size="tiny" onClick={() => {
      edit(row)
    }}>
      <SvgIcon icon="lucide:edit" class=" text-16px"/>
    </n-button>
    <n-button quaternary size="tiny" onClick={() => {
      del(row)
    }}>
      <SvgIcon icon="material-symbols:delete-outline" class="text-16px"/>
    </n-button>
  </NSpace>)
}

function renderPrefix({option}: { option: TreeOption }) {
  return (<SvgIcon icon="radix-icons:file-text" class=" text-16px"/>)
}

function handleDrop() {
}

const treeData = ref(createData())
</script>

<template>
  <n-tree
    block-line
    draggable
    @drop="handleDrop"
    :data="treeData"
    key-field="key"
    :show-line="true"
    :render-suffix="renderSuffix"
    :render-prefix="renderPrefix"
    :selectable="false"
  />
</template>

<style scoped>

</style>
