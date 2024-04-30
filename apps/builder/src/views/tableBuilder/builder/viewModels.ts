import { RCriterias, RQuery } from ':/utils/query'
import type { ViewModelEntity } from ':/typings/designer'
import { designerDoApplication } from ':/api'

const appCode = 'CHARGE'

export const viewModels = shallowRef<ViewModelEntity[]>([])

export const viewModel = ref<ViewModelEntity>({} as ViewModelEntity)

export const viewModelFields = computed(() => viewModel.value.fields || [])

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
    viewModels.value = backData as ViewModelEntity[]
  }
}

export function updateViewModel(val: ViewModelEntity) {
  viewModel.value = val
}
