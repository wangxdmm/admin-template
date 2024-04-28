import type { TableSchema } from '@runafe/unified-api-designer'
import { ColumnFixedMode, HorizontalAlign, ValueType } from '@runafe/unified-api-designer'

export const tableSchema = ref<TableSchema>({
  code: '',
  name: '',
  appCode: '',
  desc: '',
  dataSource: {
    viewModelCode: 'adept-settlement',
    serverName: 'string',
    filter: 'string',
    loadOnInit: true,
    primaryKeyFieldName: 'string',
  },
  metrics: [],
  actionConfig: {
    generalButtons: [
      { name: '111', label: '删除' },
    ],
    rowButtons: [
      { name: '111', label: '删除' },
    ],
    cellActions: [
      { name: '111', label: '删除' },
    ],
    rightClickMenus: [
      { name: '111', label: '删除' },
    ],
    treeTable: {

    },
  },
  styleConfig: {
    rowBackgroundColors: [
      { value: '#12234a', condition: '$', name: '报停' },
      { value: '#12234a', condition: '$', name: '报停1' },
    ],
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
} as unknown as TableSchema)

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
