import { designerVoCreator } from '@runafe/unified-api-designer'
import { clone } from '@monan/shared'
import { tableSchema } from './tableSchema'
import { filterableFields, viewModel } from './viewModels'
import http from ':/http'
import type { CriteriaMeta } from ':/components/criterias'

export const criteriasFields = ref<CriteriaMeta[]>([])

watch(
  () => viewModel.value.code,
  () => {
    const fields = clone(filterableFields.value) as unknown as CriteriaMeta[]
    const vo = designerVoCreator(
      http,
      tableSchema.value.dataSource.serverName,
      tableSchema.value.dataSource.viewName,
    )
    fields.forEach(async (v) => {
      if (v.type === 'ENUM') {
        const { backData } = await vo.enum({ fieldCode: v.name })()
        if (backData) {
          v.valueOptions = backData as unknown as CriteriaMeta[]
        }
      }
      else if (v.selectable) {
        const { backData } = await vo.options({
          fieldCode: v.name,
          optionQuery: {},
        })()
        if (backData) {
          v.valueOptions = backData as unknown as CriteriaMeta[]
        }
      }
    })
    criteriasFields.value = fields
  },
)
