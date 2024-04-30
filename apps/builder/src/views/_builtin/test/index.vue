<script setup lang="ts">
import { defineSchemaTable } from '@runafe/magic-system'
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
        inputComponent: `{
          $formkit: 'n:select',
          options: '1,2,3'
        }`,
      },
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
        {
          onClick: () => {
            console.log(_$)
          }
        }
        `,
      },
      {
        name: 'export',
        color: 'error',
        label: '删除',
        command: `
        {
          onClick: () => {
            console.log(_$)
          }
        }
        `,
      },
      {
        name: 'export',
        color: 'default',
        label: '导出',
        command: `
        {
          onClick: () => {
            console.log(_$.row)
          }
        }
        `,
      },
    ],
    generalButtons: [
      {
        name: 'add',
        color: 'primary',
        label: '增加',
        command: `
        {
          onClick: () => {
            _$.ctx.alert(1)
          }
        }
        `,
      },
      {
        name: 'export',
        color: 'warning',
        label: '导出',
        command: `
        {
          onClick: () => {
            _$.ctx.alert('导出')
          }
        }
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
      precision: 2,
      showThousandSeparator: true,
      colors: [
        {
          name: 'little',
          value: 'red',
          condition: `
          {
            on: () => _$.cellValue <= 800,
          }
          `,
        },
        {
          name: 'normal',
          value: 'blue',
          condition: `{
            on: () => _$.cellValue < 10000,
          }`,
        },
      ],
      backgroundColors: [
        {
          name: 'much',
          value: 'yellow',
          condition: `{
            on: () => _$.cellValue >= 1000,
          }`,
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
  data: {
    alert(...args: any[]) {
      // eslint-disable-next-line no-alert
      alert(...args)
    },
  },
})
</script>

<template>
  <rs-page>
    <Schema.Component />
  </rs-page>
</template>

<style></style>
