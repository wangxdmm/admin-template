import type { SystemConfig } from ':/types'

export function storeCreatorCreator<T>(
  storeDef: (config: SystemConfig) => T,
  after?: (store: T, config: SystemConfig) => any,
) {
  return (config: SystemConfig) => {
    const store = storeDef(config)
    after?.(store, config)
    return store
  }
}
