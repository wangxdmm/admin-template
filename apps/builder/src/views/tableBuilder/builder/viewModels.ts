import {
  designerVoCreator }
  from '@runafe/unified-api-designer'
import { tableSchema } from './tableSchema'
import { RCriterias, RQuery } from ':/utils/query'
import type { ViewModelEntity } from ':/typings/designer'
import { designerDoApplication } from ':/api'
import type { CriteriaMeta } from ':/components/criterias'
import http from ':/http'

const appCode = 'CHARGE'

const vo = designerVoCreator(http, tableSchema.value.dataSource.serverName, tableSchema.value.dataSource.viewModelCode)

export const viewModels = shallowRef<ViewModelEntity[]>([])

export const viewModel = ref<ViewModelEntity>({} as ViewModelEntity)

export const viewModelFields = computed(() => viewModel.value.fields || [])

export const filterableFields = computed(() => viewModelFields.value.map(v => v.filterable))

export const criteriasFields = ref<CriteriaMeta[]>([])

watch(() => viewModel.value.code, () => {
  const fields = filterableFields.value as unknown as CriteriaMeta[]
  fields.forEach(async (v) => {
    if (v.type === 'ENUM') {
      v.valueOptions = await getEnumOptions(v.name) as unknown as CriteriaMeta[]
    }
    else if (v.selectable) {
      v.valueOptions = await getQueryOptions(v.name) as unknown as CriteriaMeta[]
    }
  })
  criteriasFields.value = fields
})

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

async function getQueryOptions(fieldCode: string) {
  const backData = await vo.query({ fieldCode })()
  return backData || []
}

async function getEnumOptions(fieldCode: string) {
  const backData = await vo.enum({ fieldCode })()
  return backData || []
}
