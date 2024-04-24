import type { Restful, defineAPI } from '@monan/easy-axios'
import type { TableEntitySearch } from ':/typings/designer'

export function designerDoApplicationCreator<T extends Restful<any>>(http: T) {
  return http.create<[
    defineAPI<'search', Record<string, any>, TableEntitySearch[]>,
    defineAPI<'saveAndRelease', TableEntitySearch, void>,
    defineAPI<'deleteAndRelease', { code: string }, void>,
    defineAPI<'viewSearch', Record<string, any>, TableEntitySearch[]>,
    defineAPI<'getByCode', { code: string }, TableEntitySearch>,
  ]>(
    '/designer/do/application',
    [
      'post::/tableEntity/search',
      'post::/tableEntity/saveAndRelease',
      'delete::/tableEntity/deleteAndRelease?code={code}->deleteAndRelease',
      'post::/dataViewEntity/search->viewSearch',
      'get::/dataViewEntity/getByCode::?->getByCode',
    ],
  )
}
