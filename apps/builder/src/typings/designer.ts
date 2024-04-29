export interface ViewModelEntity {
  appCode: string
  code: string
  desc?: string
  fields: ViewModelField[]
  inactive: boolean
  itemId: string
  locked: boolean
  modelName: string
  serverId: string
  name: string
  orgId?: number
  actionConfig?: any
  createdAt?: string
  createdBy?: string
  lastUpdatedAt?: string
  lastUpdatedBy?: string
}

export interface ViewModelField {
  name: string
  label: string
  desc: string
  type: string
  metaCode: string
  unit: string
  attachmentSource: string
  selectable: boolean
  filterable: boolean
  supportMatchers: string[]
  sortable: boolean
  itemId: string

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
