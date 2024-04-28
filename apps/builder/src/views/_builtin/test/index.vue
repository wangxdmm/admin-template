<script setup lang="ts">
import {
  CONDITION_TAG,
  createElementStr,
  defineSchemaTable,
} from '@runafe/magic-system'
import {
  ColumnFixedMode,
  CriteriaMatcher,
  type TableSchema,
  ValueType,
} from '@runafe/unified-api-designer'

interface Entity {
  name: string
  age: number
  inSchool: boolean
  date: string
  money: number
}

const schema: TableSchema = {
  name: '1',
  appCode: '1',
  code: 'receipt_dept_audit',
  dataSource: {
    viewModelCode: 'receipt_dept_audit',
    // primaryKeyFieldName: 'index',
    serverName: 'charge-manager',
  },
  queryConfig: {
    enabled: true,
    generalQueryFields: [
      {
        name: 'inHousingId',
        label: '小区名称',
        matcher: CriteriaMatcher.IN,
        inputComponent: `<Query $formkit="n:select" options="$_T.STORE.get('inHousingId').options" />`,
      },
      // {
      //   name: 'name',
      //   matcher: CriteriaMatcher.EQ,
      //   label: '姓名',
      //   inputComponent: `<Query $formkit="n:password" />`,
      // },
    ],
    advancedQueryFields: [],
  },
  styleConfig: {
    rowHeight: 80,
  },
  actionConfig: {
    rowSelect: {
      enabled: true,
      maxSize: 0,
    },
    rowButtons: [
      {
        name: 'add',
        color: 'primary',
        label: '增加',
        command: `
        <Action onClick="_T.DATA.newName = 'new name'" />
        `,
      },
      {
        name: 'export',
        color: 'error',
        label: '删除',
        command: `
        <Action onClick="alert('delete')" />
        `,
      },
      {
        name: 'export',
        color: 'default',
        label: '导出',
        command: `
        <Action onClick="alert('export')" />
        `,
      },
    ],
    generalButtons: [
      {
        name: 'add',
        color: 'primary',
        label: '增加',
        command: `
        <Action onClick="_T.DATA.newName = 'new name'" />
        `,
      },
      {
        name: 'export',
        color: 'warning',
        label: '导出',
        command: `
        <Action onClick="alert('export')" />
        `,
      },
    ],
  },
  columns: [
    {
      name: 'bankName',
      label: '所属银行',
      type: ValueType.STRING,
    },
    {
      name: 'inHousingId',
      label: '小区id',
      type: ValueType.STRING,
      selectable: true,
      precision: 2,
      showThousandSeparator: true,
      colors: [
        {
          name: 'little',
          value: 'red',
          condition: createElementStr(CONDITION_TAG, {
            value: `_T.RV <= 800`,
          }),
        },
        {
          name: 'normal',
          value: 'blue',
          condition: createElementStr(CONDITION_TAG, {
            value: `_T.RV > 800 && _T.RV <= 1800`,
          }),
        },
      ],
      backgroundColors: [
        {
          name: 'much',
          value: 'yellow',
          condition: createElementStr(CONDITION_TAG, {
            value: `_T.RV > 1900`,
          }),
        },
      ],
    },
    // {
    //   name: 'inSchool',
    //   label: '是否上学',
    //   type: ValueType.BOOLEAN,
    // },
    // {
    //   name: 'date',
    //   label: '上学日期',
    //   type: ValueType.DATE,
    //   render: createElementStr(COLUMN_RENDER, {
    //     formatter: 'yyyy-MM-dd',
    //   }),
    // },
    // {
    //   name: 'age',
    //   label: '年龄',
    //   type: ValueType.NUMBER,
    // },
  ],
  headerColumns: [],
  pagination: {
    pageSizes: [
      {
        size: 10,
      },
      {
        size: 20,
      },
      {
        size: 30,
        defaultOption: true,
      },
    ],
    align: ColumnFixedMode.RIGHT,
    showTotal: true,
  },
}

const Schema = defineSchemaTable<Entity>(schema, {
  data: {},
})
</script>

<template>
  <rs-page>
    <Schema.Component />
  </rs-page>
</template>

<style></style>
