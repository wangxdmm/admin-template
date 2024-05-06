import {
  designerVoCreator }
  from '@runafe/unified-api-designer'
import { tableSchema } from './tableSchema'
import { filterableFields, viewModel } from './viewModels'
import http from ':/http'
import type { CriteriaMeta } from ':/components/criterias'

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
  console.log(criteriasFields.value, 1111111)
})
const vo = designerVoCreator(http, tableSchema.value.dataSource.serverName, tableSchema.value.dataSource.viewModelCode)

async function getQueryOptions(fieldCode: string) {
  const { backData } = await vo.query({ fieldCode })()
  return backData || []
}

async function getEnumOptions(fieldCode: string) {
  const { backData } = await vo.enum({ fieldCode })()
  return backData || []
}
