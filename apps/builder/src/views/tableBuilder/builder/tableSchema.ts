import type {
  Column,
  QuerySingleCriteria,
  TableSchema,
} from '@runafe/unified-api-designer'
import { ColumnFixedMode, HorizontalAlign, ValueType } from '@runafe/unified-api-designer'
import { pick } from 'lodash-es'
import { viewModelFields } from './viewModels'
import { matcherList } from './block/common'

export const defaultColumn = {
  description: '',
  align: HorizontalAlign.LEFT,
  resizable: false,
  sortable: false,
  fixed: ColumnFixedMode.NONE,
  type: ValueType.STRING,
  editable: false,
  wordWrap: false,
  textRows: 2,
  precision: 2,
  showThousandSeparator: true,
  render: '',
  useCopy: false,
  colors: [],
  backgroundColors: [],
}

export const defaultTable: TableSchema = {
  code: '',
  name: '',
  appCode: '',
  desc: '',
  dataSource: {
    viewModelCode: '',
    serverName: 'charge-manager',
    loadOnInit: true,
    primaryKeyFieldName: '',
  },
  metrics: [],
  actionConfig: {
    generalButtons: [],
    rowButtons: [],
    cellActions: [],
    rightClickMenus: [],
    rowSelect: {
      enabled: false,
    },
  },
  styleConfig: {
    rowBackgroundColors: [],
  },
  columns: [],
  headerColumns: [],
  pagination: {
    pageSizes: [
      { size: 10, defaultOption: true },
      { size: 20, defaultOption: false },
    ],
  },
  queryConfig: {
    enabled: false, // 启用
    generalQueryFields: [], // 普通查询字段
    advancedQueryFields: [], // 高级查询字段
  },
}
const cacheData = ref<string>(JSON.stringify(defaultTable))
export const tableSchema: Ref<TableSchema> = ref(defaultTable as TableSchema)

export const tableColumns: ComputedRef<Column[]> = computed(() => tableSchema.value.columns || [])

export function updateSchema(val: TableSchema) {
  const defaultTable = getDefaultTable()
  for (const key in val) {
    if (val[key]) {
      defaultTable[key] = val[key]
    }
  }
  tableSchema.value = defaultTable
  cacheData.value = JSON.stringify(defaultTable)
}
export function getCache() {
  return cacheData.value
}
export function restData(): TableSchema {
  // 重置数据内容
  const restTable: TableSchema = {
    ...pick(tableSchema.value, ['code', 'name', 'desc', 'appCode', 'dataSource']),
    queryConfig: {
      enabled: false,
      generalQueryFields: [],
      advancedQueryFields: [],
    },
    actionConfig: {
      userCustom: {
        enabled: true,
      },
      rowSelect: {
        enabled: true,
        maxSize: 0,
      },
      treeTable: {
        enabled: false,
        nodeField: '',
        parentField: '',
      },
      generalButtons: [
        {
          name: 'ADD',
          label: '新增',
          color: 'primary',
          command: '',
        },
        {
          name: 'DELETE',
          label: '删除',
          color: 'error',
          command: '',
        },
      ],
      rowButtons: [{
        name: 'EDIT',
        label: '修改',
        color: 'primary',
        command: '',
      }, {
        name: 'DELETE',
        label: '删除',
        color: 'error',
        command: '',
      }],
      rightClickMenus: [],
      cellActions: [],
    },
    styleConfig: {
      bordered: false,
      stripe: true,
      rowBackgroundColors: [],
    },
    columns: [],
    headerColumns: [],
    pagination: {
      enabled: true,
      align: ColumnFixedMode.RIGHT,
      pagerCount: 5,
      showTotal: true,
      numberJump: true,
      endless: false,
      pageSizes: [{
        size: 20,
        defaultOption: true,
      }, {
        size: 50,
        defaultOption: false,
      }, {
        size: 100,
        defaultOption: false,
      }, {
        size: 500,
        defaultOption: false,
      }, {
        size: 3000,
        defaultOption: false,
      }],
    },
  }
  const queryList = viewModelFields.value.filter(v => v.filterable)
  queryList.forEach((v, index) => {
    let matcherItem = {} as unknown as QuerySingleCriteria
    if (Array.isArray(v.supportMatchers)) {
      matcherItem = matcherList.find(m => v.supportMatchers.includes(m.matcher)) as QuerySingleCriteria
    }
    if (index < 5) {
      restTable.queryConfig?.generalQueryFields.push({ name: v.name, label: v.label, matcher: matcherItem.matcher, inputComponent: '', defaultValue: null })
    }
    restTable.queryConfig?.advancedQueryFields.push({ name: v.name, label: v.label, matchers: [matcherItem.matcher] })
  })
  queryList.slice(0, 20).forEach((v) => {
    const column = { ...defaultColumn, name: v.name, label: v.label, align: v.type === ValueType.NUMBER ? HorizontalAlign.RIGHT : HorizontalAlign.LEFT } as Column
    restTable.columns.push(column)
  })

  return restTable
}
export function getDefaultTable() {
  return {
    code: '',
    name: '',
    appCode: '',
    desc: '',
    dataSource: {
      viewModelCode: '',
      serverName: 'charge-manager',
      filter: '',
      loadOnInit: true,
      primaryKeyFieldName: '',
    },
    metrics: [],
    actionConfig: {
      generalButtons: [],
      rowButtons: [],
      cellActions: [],
      rightClickMenus: [],
      treeTable: {
        nodeField: '11',
        parentField: '11',

      },
      rowSelect: {
        enabled: false,
      },
    },
    styleConfig: {
      rowBackgroundColors: [],
    },
    columns: [],
    headerColumns: [],
    pagination: {
      pageSizes: [
        { size: 10, defaultOption: true },
        { size: 20, defaultOption: false },
      ],
    },
    queryConfig: {
      enabled: false, // 启用
      generalQueryFields: [], // 普通查询字段
      advancedQueryFields: [], // 高级查询字段
    },
  }
}
