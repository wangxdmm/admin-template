export interface viewModelEntity {
  appCode: string
  code: string
  desc: string
  name: string
  actionConfig?: any
  columns?: any
  createdAt?: string
  createdBy?: string
  dataSource?: string
  headerColumns?: any
  itemId?: string
  lastUpdatedAt?: string
  lastUpdatedBy?: string
  orgId?: any
  pagination?: any
  queryConfig?: any
  styleConfig?: any
}

export interface TableEntitySearch {
  appCode: string
  code: string
  name: string
  desc: string
  itemId?: string
  lastUpdatedAt?: string
  lastUpdatedBy?: string
  createdAt?: string
  createdBy?: string
  orgId?: number
}
