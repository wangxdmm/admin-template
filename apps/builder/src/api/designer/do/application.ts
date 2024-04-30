import type { Restful, defineAPI } from '@monan/easy-axios'
import type {
  TableSchema,
} from '@runafe/unified-api-designer'
import type { ViewModelEntity } from ':/typings/designer'

export function designerDoApplicationCreator<T extends Restful<any>>(http: T) {
  return http.create<[
    defineAPI<'search', Record<string, any>, ViewModelEntity[]>,
    defineAPI<'saveAndRelease', TableSchema, void>,
    defineAPI<'deleteAndRelease', { code: string }, void>,
    defineAPI<'viewSearch', Record<string, any>, ViewModelEntity[]>,
    defineAPI<'getByCode', { code: string }, ViewModelEntity>,
    defineAPI<'getTableSchema', { code: string }, TableSchema>,
    defineAPI<'save', TableSchema, void>,
    defineAPI<'add', TableSchema, void>,
  ]>(
    '/designer/do/application',
    [
      'post::/tableEntity/search',
      'post::/tableEntity/saveAndRelease',
      'delete::/tableEntity/deleteAndRelease?code={code}->deleteAndRelease',
      'post::/dataViewEntity/search->viewSearch',
      'get::/dataViewEntity/getByCode::?->getByCode',
      'get::/tableEntity/getByCode?code={code}->getTableSchema',
      'put::/tableEntity/save',
      'post::/tableEntity/add',
    ],
  )
}
