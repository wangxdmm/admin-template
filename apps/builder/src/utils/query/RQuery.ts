import type { AdvancedCriteria } from '.'

export class RQuery<T = AdvancedCriteria> {
  // 查询规则
  criteria?: T

  // 排序规则
  sort?: SortOrder[]

  // 数据加载位置信息
  offset?: string

  // 当前页, 从0开始
  pageIndex?: number

  // 指定一页查询多少条数据
  pageSize?: number

  // 指定查询哪些字段
  fields?: string[]

  constructor(
    criteria?: T,
    sort?: SortOrder[],
    offset?: string,
    pageIndex?: number,
    pageSize?: number,
    fields?: string[],
  ) {
    this.criteria = criteria
    this.sort = sort
    this.offset = offset
    this.pageIndex = pageIndex
    this.pageSize = pageSize
    this.fields = fields
  }

  static of<T = AdvancedCriteria>(
    criteria?: T,
    sort?: SortOrder[],
    pageIndex?: number,
    pageSize?: number
  ): RQuery<T>
  static of<T = AdvancedCriteria>(
    criteria?: T,
    sort?: SortOrder[],
    offset?: string,
    pageSize?: number
  ): RQuery<T>
  static of<T = AdvancedCriteria>(
    criteria?: T,
    sort?: SortOrder[],
    pageFlag?: number | string,
    pageSize?: number,
  ): RQuery<T> {
    if (typeof pageFlag === 'number')
      return new RQuery(criteria, sort, undefined, pageFlag, pageSize)

    return new RQuery(criteria, sort, pageFlag, 0, pageSize)
  }

  static sortBy<T = AdvancedCriteria>(
    field: string,
    direction: Direction,
  ): RQuery<T> {
    return new RQuery({} as T, Sort.by(field, direction))
  }

  sortBy(field: string, direction: Direction): RQuery<T> {
    this.sort = this.sort || []
    this.sort.push({ field, direction })
    return this
  }

  paging(page: number, size: number): RQuery<T>
  paging(offset: string, size: number): RQuery<T>
  paging(pageFlag: number | string, size: number): RQuery<T> {
    if (typeof pageFlag === 'number')
      this.pageIndex = pageFlag

    else
      this.offset = pageFlag

    this.pageSize = size
    return this
  }

  with(...fields: string[]): RQuery<T> {
    this.fields = fields
    return this
  }
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortOrder {
  field?: string
  direction?: Direction
}

export class Sort extends Array<SortOrder> {
  static by(field: string, direction: Direction): Sort {
    const sort = new Sort()
    sort.push({ field, direction })
    return sort
  }

  and(field: string, direction: Direction): Sort {
    this.push({ field, direction })
    return this
  }
}
