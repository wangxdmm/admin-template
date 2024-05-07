import { computed, ref, shallowRef, toValue } from 'vue'
import type { ExtractPropTypes, MaybeRefOrGetter, VNode } from 'vue'
import { NAlert, NButton, NInput, NSpace, NTag } from 'naive-ui'
import { notEmpty } from '@monan/shared'
import { defineModal } from '@runafe/magic-system'
import type {
  AdvancedCriteria,
  CriteriaMeta,
} from './type'
import type { ConditionProps } from './criterias'
import Conditions from './criterias'
import { matcherMap } from './share'

export function useBatchAddEditor(initValue: MaybeRefOrGetter<string>) {
  const text = ref(toValue(initValue))
  const tags = computed(() =>
    [...new Set(text.value?.split('\n'))]?.filter(notEmpty).slice(0, 200),
  )

  return {
    editorCreator: (message?: () => string | VNode | VNode[]) => {
      return (
        <>
          <NAlert
            title="注意"
            bordered={false}
            type="warning"
            class="mb-16px text-12px"
          >
            按换行符分隔，每行算一个数据，最多支持200行数据，超出部分将忽略。
            输入多个相同的数据只会保留一个。
          </NAlert>
          <NSpace class="mb-16px">
            当前条件：
            {message?.()}
          </NSpace>
          <NInput
            rows={12}
            value={text.value}
            onUpdate:value={v => (text.value = v)}
            type="textarea"
          >
          </NInput>
        </>
      )
    },
    setValue: (v: string) => {
      text.value = v
    },
    text,
    tags,
    reset,
  }

  function reset() {
    text.value = toValue(initValue)
  }
}

export function useCriterias(
  options: Ref<CriteriaMeta[]>,
  config?: {
    initValue?: AdvancedCriteria
    onSubmit?: (v: AdvancedCriteria) => any
    schemaData?: {
      valueField?: string
      labelField?: string
    }
    attrs?: Partial<ExtractPropTypes<ConditionProps>>
  },
) {
  const criteriaValue = ref<AdvancedCriteria>(
    config?.initValue as AdvancedCriteria,
  )
  const metaMap = shallowRef(new Map<string, CriteriaMeta>())
  const modal = defineModal({
    delay: true,
    width: 900,
    maxHeight: 600,
  })
  const { editorCreator, setValue, tags, reset } = useBatchAddEditor('')
  const batchAdd: ExtractPropTypes<ConditionProps>['onBatchAdd'] = ({
    meta,
    item,
  }) => {
    setValue(item.values?.join?.('\n') || '')

    modal
      .spawn(
        {
          width: 600,
        },
        false,
      )
      .load({
        title: () => `添加多行数据`,
        default: () =>
          editorCreator(() => [
            <NTag size="small" type="primary">
              {meta.label}
            </NTag>,
            <NTag size="small" type="primary">
              {matcherMap.get(item.matcher)}
            </NTag>,
          ]),
        footer: () => [
          <NButton
            onClick={() => {
              reset()
              modal.closeAt()
            }}
          >
            取 消
          </NButton>,
          <NButton
            type="primary"
            onClick={() => {
              item.values = tags.value
              modal.closeAt()
            }}
          >
            确 定
          </NButton>,
        ],
      })
      .open()
  }

  return {
    use: () => {
      modal
        .load({
          title: () => '条件表达式',
          default: () => {
            return [
              <Conditions
                value={criteriaValue.value}
                data={
                  config?.schemaData
                }
                options={options }
                onSubmit={(v) => {
                  pure(v)
                  criteriaValue.value = v
                  modal.close()
                  config?.onSubmit?.(v)
                }}
                onCancel={modal.close}
                onBatchAdd={batchAdd}
                onMetaMapCreated={v => (metaMap.value = v.value)}
              ></Conditions>,
            ]
          },
        })
        .open()
    },
    modal,
    criteriaValue,
    metaMap,
  }
}

function pure(criteria: AdvancedCriteria) {
  delete criteria.id
  delete criteria.disabled
  delete criteria.parent
  criteria.boolCriterias.forEach((c) => {
    pure(c)
  })
}
