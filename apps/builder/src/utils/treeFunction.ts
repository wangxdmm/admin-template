import { flatten } from 'un-flatten-tree'

export function traverseTree(tree: any) {
  return flatten(
    tree,
    (node: any) => node.children,
    node => node,
  )
}
