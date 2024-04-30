export interface CriteriaItem {
  label?: string
  value?: string
  disabled?: boolean
  [index: string]: any
}

export enum ValueTypeEnums {
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  ENUM = 'ENUM',
}

export enum CriteriaMatcherEnums {
  ISNULL = 'ISNULL',
  NOT_NULL = 'NOT_NULL',
  EQ = 'EQ',
  NOT_EQ = 'NOT_EQ',
  GT = 'GT',
  GE = 'GE',
  LT = 'LT',
  LE = 'LE',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT_LIKE',
  PREFIX_LIKE = 'PREFIX_LIKE',
  SUFFIX_LIKE = 'SUFFIX_LIKE',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT_BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
}

export interface ConditionContext {
  options: CriteriaMeta[]
  setCurrentCreator: (k: number) => void
  meta: (k: number, attr?: string) => CriteriaMeta | undefined
  dynTrait: (k: number) => string
  logicOptions: any
  valueField: string
  labelField: string
  [index: string]: any
}

export interface AdvancedCriteria {
  id?: number
  logic: 'AND' | 'OR'
  singleCriterias: CriteriaEntity[]
  boolCriterias: AdvancedCriteria[]
  parent?: number
  disabled?: boolean
}

export interface CriteriaEntity {
  fieldName: string
  matcher: CriteriaMatcherEnums
  values?: any
}

export interface CriteriaMeta {
  name: string
  label: string
  description?: string
  type: ValueTypeEnums
  selectable: boolean
  filterable: boolean
  supportMatchers?: CriteriaMatcherEnums[]
  valueOptions?: CriteriaItem[]
  matcherOptions: CriteriaItem[]
  disabled?: boolean
  propsGetter?: (
    criteria: CriteriaEntity,
    meta: CriteriaMeta,
  ) => Record<string, any>
}

// export interface CriteriaOption {
//   name: string
//   label: string
//   description?: string
//   type: ValueTypeEnums
//   selectable: boolean
//   supportMatchers?: CriteriaMatcherEnums[]
//   sortable: boolean
//   valueOptions?: any[]
// }
