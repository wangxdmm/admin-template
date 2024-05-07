import type { AdvancedCriteria, CriteriaEntity } from './type'
import { CriteriaMatcherEnums } from './type'

export const matcherMap = new Map([
  [CriteriaMatcherEnums.EQ, '等于'],
  [CriteriaMatcherEnums.NOT_EQ, '不等于'],
  [CriteriaMatcherEnums.ISNULL, '等于空'],
  [CriteriaMatcherEnums.NOT_NULL, '不等于空'],
  [CriteriaMatcherEnums.GT, '大于'],
  [CriteriaMatcherEnums.GE, '大于等于'],
  [CriteriaMatcherEnums.LT, '小于'],
  [CriteriaMatcherEnums.LE, '小于等于'],
  [CriteriaMatcherEnums.LIKE, '包含'],
  [CriteriaMatcherEnums.NOT_LIKE, '不包含'],
  [CriteriaMatcherEnums.PREFIX_LIKE, '开始于'],
  [CriteriaMatcherEnums.SUFFIX_LIKE, '结束于'],
  [CriteriaMatcherEnums.BETWEEN, '介于'],
  [CriteriaMatcherEnums.NOT_BETWEEN, '不介于'],
  [CriteriaMatcherEnums.IN, '存在于'],
  [CriteriaMatcherEnums.NOT_IN, '不存在于'],
])

export function createEmptyCondition(defaultField: string) {
  return {
    fieldName: defaultField,
    matcher: CriteriaMatcherEnums.EQ,
  } as CriteriaEntity
}

export function createEmptyGroup(id: number = 0, defaultField: string): AdvancedCriteria {
  return {
    id,
    logic: 'AND',
    singleCriterias: [createEmptyCondition(defaultField)],
    boolCriterias: [],
  } as unknown as AdvancedCriteria
}
