import type { Option } from ':/types'

/**
 * Transform record to option
 *
 * @example
 *   ;```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(
  record: T,
) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label,
  })) as Option<keyof T>[]
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: Option<string>[]) {
  return options.map(option => ({
    ...option,
  }))
}
