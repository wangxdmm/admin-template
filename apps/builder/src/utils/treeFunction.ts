import { flatten } from 'un-flatten-tree'
import type { HeaderColumn } from '@runafe/unified-api-designer'

export function traverseTree(tree: HeaderColumn, key: keyof HeaderColumn) {
  return flatten(
    [tree],
    (node: any) => node.children,
    node => node[key],
  )
}
