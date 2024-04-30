import { CriteriaMatcher } from '@runafe/unified-api-designer'
import type { QuerySingleCriteria } from '@runafe/unified-api-designer'

export const matcherList: QuerySingleCriteria[] = [{ fieldName: '等于空', matcher: CriteriaMatcher.ISNULL }, { fieldName: '不等于空', matcher: CriteriaMatcher.NOT_NULL }, {
  fieldName: '等于',
  matcher: CriteriaMatcher.EQ,
}, { fieldName: '不等于', matcher: CriteriaMatcher.NOT_EQ }, { fieldName: '大于', matcher: CriteriaMatcher.GT }, { fieldName: '大于等于', matcher: CriteriaMatcher.GE }, {
  fieldName: '小于',
  matcher: CriteriaMatcher.LT,
}, { fieldName: '小于等于', matcher: CriteriaMatcher.LE }, { fieldName: '包含', matcher: CriteriaMatcher.LIKE }, { fieldName: '不包含', matcher: CriteriaMatcher.NOT_LIKE }, { fieldName: '开始于', matcher: CriteriaMatcher.PREFIX_LIKE }, {
  fieldName: '结束于',
  matcher: CriteriaMatcher.SUFFIX_LIKE,
}, { fieldName: '介于', matcher: CriteriaMatcher.BETWEEN }, { fieldName: '不介于', matcher: CriteriaMatcher.NOT_BETWEEN }, { fieldName: '存在于', matcher: CriteriaMatcher.IN }, { fieldName: '不存在于', matcher: CriteriaMatcher.NOT_IN }]
