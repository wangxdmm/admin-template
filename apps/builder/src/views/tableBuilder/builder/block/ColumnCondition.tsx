import { defineModal } from '@runafe/magic-system'
import { NButton, NCheckbox, NEllipsis, NEmpty, NInput, NSpace } from 'naive-ui'
import { match } from 'pinyin-pro'
import type { FieldCheck } from ':/views/tableBuilder/builder/block/common'

export function useColumnCondition() {
  const modal = defineModal({
    width: 470,
  })
  return {
    use: (options: { title?: string, columns: FieldCheck[], save: (columns: FieldCheck[]) => void }) => {
      const copylists = ref([...options.columns])
      const lists = ref([...options.columns])
      const search = ref<string>()
      function changeAll(flag: boolean) {
        copylists.value.forEach((v) => {
          v.check = flag
        })
      }

      function invert() {
        copylists.value.forEach((v) => {
          v.check = !v.check
        })
      }

      watch(() => search.value, (pattern) => {
        if (pattern) {
          lists.value = copylists.value.filter(c => c?.label
          && match(c?.label, pattern, {
            continuous: true,
            precision: 'start',
          }))
        }
        else {
          lists.value = [...copylists.value]
        }
      })
      modal.load({
        title: () => options.title ? options.title : '添加查询条件',
        default: () => ([
          <div class="mb-16px gap-16px">
            <NSpace>
              <NInput size="small" value={search.value} onUpdate:value={(v) => {
                search.value = v
              }}>
                {{
                  prefix: () => (<svgIcon icon="ic:round-add" className="inline-block align-text-bottom text-16px"/>),
                }}
              </NInput>
              <NButton size="small" type="primary" onClick={() => {
                changeAll(true)
              }}>全选</NButton>
              <NButton size="small" onClick={() => {
                invert()
              }}>反选</NButton>
            </NSpace>
          </div>,
          <n-scrollbar style="max-height: 400px">
          <div class={{
            ':uno: flex flex-wrap gap-4':
              true,
          }}>
              {lists.value.length > 0
                ? lists.value.map(element => (<div
                  key={element.name}
                  class={{
                    ':uno: w-50 bg-#f5f7fa b-1 b-solid h-32px pl-8px flex-sb_c b-#d9e2e8 b-rd-5px':
                      true,
                  }}
                >
                  <NCheckbox checked={element.check}
                            onUpdate:checked={(v) => {
                              element.check = v
                            }}>
                    <NEllipsis class="ml-4px overflow-hidden max-w-200px!">
                      {element.label}
                    </NEllipsis>
                  </NCheckbox>
                </div>))
                : <div class="m-auto w-100px"><NEmpty size="small" description="无数据"></NEmpty></div>
                }

          </div>
          </n-scrollbar>,
        ]),
        footer: () => [
          <NButton
            onClick={() => {
              modal.close()
            }}
          >
            关 闭
          </NButton>,
          <NButton type="primary" onClick={() => {
            modal.close()
            options.save(unref(copylists))
          }}>
            确 定
          </NButton>,
        ],
      }).open()
    },
  }
}
