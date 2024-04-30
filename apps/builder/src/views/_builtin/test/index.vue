<script setup lang="ts">
import { defineSchemaTable, tableHelp } from '@runafe/magic-system'
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
            console.log($$)
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
            console.log($$)
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
            console.log($$.row)
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
            $$.ctx.alert(1)
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
            $$.ctx.alert('导出')
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
      useCopy: true,
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
            if: () => $$.cellValue <= 800,
          }
          `,
        },
        {
          name: 'normal',
          value: 'blue',
          condition: `{
            if: () => $$.cellValue < 10000,
          }`,
        },
      ],
      backgroundColors: [
        {
          name: 'much',
          value: 'yellow',
          condition: `{
            if: () => $$.cellValue >= 1000,
          }`,
        },
      ],
    },
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
    <pre>{{ tableHelp.btnCommand }}</pre>
    <Schema.Component />
  </rs-page>
</template>

<style></style>
