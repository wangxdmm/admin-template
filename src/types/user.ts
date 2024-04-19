export interface UserInfo {
  administrationName?: string
  name?: string
  attribute?: string
  roleType?: string
  userName?: string
  userId: string
  realName?: string
  haveCustomerService?: string
  administrationCode?: string
  roles: string[]
  [index: string]: any
}

export interface UserLoginParam {
  username: string
  password: string
  [index: string]: any
}
