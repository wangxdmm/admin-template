import { defineModal } from '@runafe/magic-system'
import { NButton, NCheckbox, NEllipsis, NIcon, NInput, NSpace } from 'naive-ui'
import type { Field } from '@runafe/unified-api-designer'
import { match } from 'pinyin-pro'

export function useColumnCondition() {
  const modal = defineModal({
    width: 470,
  })
  return {
    use: (options: { title?: string, columns: Field[], save: (columns: Field[]) => void }) => {
      const copylists = ref([...options.columns])
      const lists = ref([...options.columns])
      const search = ref<string>()
      function changeAll(flag: boolean) {
        copylists.value.forEach((v) => {
          v.selectable = flag
        })
      }

      function invert() {
        copylists.value.forEach((v) => {
          v.selectable = !v.selectable
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
                  prefix: () => (<NIcon size={16}>
                    <svg t="1713342990761" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1544" width="200" height="200">
                      <path
                        d="M999.073 878.496L754.049 633.328c-2.856-2.856-6.056-5.032-9.032-7.312a402.928 402.928 0 0 0 65.488-220.72C810.617 181.512 629.249 0 405.361 0 181.481 0 0.001 181.504 0.001 405.304c0 223.912 181.48 405.304 405.248 405.304 81.488 0 157.144-24.24 220.8-65.608 2.288 3.08 4.456 6.168 7.2 8.912l245.024 245.056a85.064 85.064 0 0 0 60.344 25.032c21.824 0 43.656-8.344 60.344-24.92 33.368-33.256 33.368-87.32 0.112-120.584M405.369 682.704C252.457 682.704 128.001 558.24 128.001 405.304c0-152.816 124.456-277.288 277.36-277.288 152.92 0 277.256 124.472 277.256 277.4 0 152.816-124.456 277.288-277.248 277.288"
                        p-id="1545"></path>
                    </svg>
                  </NIcon>),
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
              {
                lists.value.map(element => (<div
                  key={element.name}
                  class={{
                    ':uno: w-50 bg-#f5f7fa b-1 b-solid h-32px pl-8px flex-sb_c b-#d9e2e8 b-rd-5px':
                      true,
                  }}
                >
                  <NCheckbox checked={element.selectable}
                            onUpdate:checked={(v) => {
                              element.selectable = v
                            }}>
                    <NEllipsis class="ml-4px overflow-hidden max-w-200px!">
                      {element.label}
                    </NEllipsis>
                  </NCheckbox>
                </div>))
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
