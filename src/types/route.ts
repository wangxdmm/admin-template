import type { AtLeast } from '@monan/types'
import type { _RouteRecordBase } from 'vue-router'

export interface ServerMenuDefinition {
  order: number
  definition: ServerMenu
}

export interface ServerMenuMeta {
  tabId: number
  icon: string
  alias: string
  id: string
  title: string
}

export interface ServerMenu {
  path: string
  component: string
  name: string
  meta: AtLeast<ServerMenuMeta, 'id'>
  children: ServerMenu[]
}

export type ElegantConstRoute = Omit<
  _RouteRecordBase,
  'name' | 'path' | 'children'
> & {
  name: string
  path: string
  component?: string
  children?: ElegantConstRoute[]
}
