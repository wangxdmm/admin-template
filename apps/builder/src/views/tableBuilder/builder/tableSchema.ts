import type {
  Column,
  TableSchema,
} from '@runafe/unified-api-designer'
import { ColumnFixedMode, HorizontalAlign, ValueType } from '@runafe/unified-api-designer'

export const tableSchema: Ref<TableSchema> = ref({ dataSource: { serverName: 'charge-manager' } } as TableSchema)

export const tableColumns: ComputedRef<Column[]> = computed(() => tableSchema.value.columns || [])

export const defaultColumn = {
  description: '',
  align: HorizontalAlign.LEFT,
  resizable: false,
  sortable: false,
  fixed: ColumnFixedMode.NONE,
  type: ValueType.STRING,
  editable: false,
  wordWrap: false,
  textRows: null,
  precision: null,
  showThousandSeparator: true,
  render: null,
  useCopy: false,
  colors: [],
  backgroundColors: [],
}

export const defaultTable = {
  code: '',
  name: '',
  appCode: '',
  desc: '',
  dataSource: {
    viewModelCode: '',
    serverName: '',
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

export function updateSchema(val: TableSchema) {
  tableSchema.value = val
}
