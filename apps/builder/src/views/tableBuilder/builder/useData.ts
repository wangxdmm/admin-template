import { RCriterias, RQuery } from ':/utils/query'
import type { viewModelEntity } from ':/typings/designer'
import { designerDoApplication } from ':/api'

const appCode = 'CHARGE'

export const viewModels = shallowRef<viewModelEntity[]>([])

function init() {
  getViewModels()
}

init()

async function getViewModels() {
  const query = RQuery.of(
    RCriterias.must(RCriterias.eq('appCode', appCode)),
    [],
    0,
    -1,
  )
  const { backData } = await designerDoApplication.viewSearch(query)()
  if (backData) {
    viewModels.value = backData
  }
}
