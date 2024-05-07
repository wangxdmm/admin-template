import { FormKit, FormKitSchema } from '@formkit/vue'
import { NButton, NTag } from 'naive-ui'
import {
  defineComponent,
  markRaw,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'
import type { PropType, Ref } from 'vue'
import autoAnimate from '@formkit/auto-animate'
import type { AnyFn } from '@monan/types'
import Close, { fkDebug, renderIf } from '@runafe/magic-system'
import { getNode } from '@formkit/core'
import { clone } from '@monan/shared'
import { conditionSchema } from './schema'
import type {
  AdvancedCriteria,
  ConditionContext,
  CriteriaEntity,
  CriteriaMeta,
} from './type'
import { CriteriaMatcherEnums, ValueTypeEnums } from './type'
import { createEmptyCondition, createEmptyGroup, matcherMap } from './share'

export const DEFAULT_LINKTYPE = 'AND'

export const conditonProps = {
  data: {
    type: Object as PropType<any>,
  },
  options: {
    type: Object as PropType<Ref<CriteriaMeta[]>>,
    default: () => ref([]),
  },
  value: {
    type: Object as PropType<AdvancedCriteria>,
  },
  onSubmit: {
    type: Function as PropType<(v: AdvancedCriteria) => void>,
  },
  onCancel: {
    type: Function as PropType<(v?: AdvancedCriteria) => void>,
  },
  onBatchAdd: {
    type: Function as PropType<
      (options: {
        meta: CriteriaMeta
        item: CriteriaEntity
      }) => void
    >,
  },
  onMetaMapCreated: {
    type: Function as PropType<(v: Ref<Map<string, CriteriaMeta>>) => any>,
  },

}

export type ConditionProps = typeof conditonProps

export default defineComponent({
  name: 'Criterias',
  props: conditonProps,
  setup(props, { emit }) {
    const library = markRaw({
      IconClose: Close,
    })
    const animationEl = ref<HTMLDivElement | null>(null)
    const schema = ref(conditionSchema)

    const criteriaValue = ref({}) as Ref<AdvancedCriteria>

    const options = shallowRef<CriteriaMeta[]>([])

    const defaultField = computed(() => options.value[0]?.name)

    const metaMap = shallowRef<Map<string, CriteriaMeta>>(new Map())

    onMounted(() => {
      animationEl.value && autoAnimate(animationEl.value)
    })

    let criteriaIndex = 0
    const criteriaMap = new Map()

    watch(
      () => props.value,
      (v) => {
        nextTick(() => {
          criteriaValue.value = v ? clone(v) : createEmptyGroup(0, defaultField.value)
          criteriaIndex = 0
          initCriteria(criteriaValue.value)
        })
      },
      {
        immediate: true,
      },
    )

    function initCriteria(criteria: AdvancedCriteria) {
      criteria.id = criteriaIndex
      const pc = criteriaMap.get(criteria.parent)

      if (criteria.id === 0) {
        criteria.disabled = true
      }
      else if (pc?.disabled && ((pc?.singleCriterias.length === 0 && pc?.boolCriterias.length <= 1))) {
        criteria.disabled = true
      }
      else {
        criteria.disabled = false
      }

      criteriaMap.set(criteriaIndex, criteria)
      criteria.boolCriterias.forEach((c) => {
        c.parent = criteria.id
        criteriaIndex++
        initCriteria(c)
      })
    }

    function removeGroup(boolCriterias: AdvancedCriteria[], id: number) {
      const index = boolCriterias.findIndex(c => c.id === id)
      if (index > -1) {
        boolCriterias.splice(index, 1)
        return
      }
      boolCriterias.forEach((c) => {
        removeGroup(c.boolCriterias, id)
      })
    }

    watch(
      () => props.options.value,
      (val) => {
        const ops: CriteriaMeta[] = []
        val?.forEach((c) => {
          if (c.filterable) {
            const op = {
              ...c,
              matcherOptions: c.supportMatchers?.map(m => ({ label: matcherMap.get(m), value: m })) || [],
              valueOptions: c?.valueOptions || [],
            }
            ops.push(op)
            metaMap.value.set(c.name, markRaw(op))
          }
        })
        props.onMetaMapCreated?.(metaMap)
        options.value = ops
      },
      {
        immediate: true,
      },
    )

    function renderCondition(conditionValue: AdvancedCriteria, isRoot?: boolean) {
      const logic = ref(conditionValue.logic)
      const showCriteria = computed(() => !!(conditionValue.boolCriterias?.length || conditionValue.singleCriterias?.length))
      const conditionContext: ConditionContext = {
        animationEl: (c: HTMLDivElement) => (animationEl.value = c),
        options,
        conditionValue,
        createPropsGetter(index: number) {
          const curCriteria = conditionValue.singleCriterias[index]
          const meta = metaMap.value.get(curCriteria?.fieldName)

          const propsAttrs = meta?.propsGetter?.(curCriteria, meta) || {}

          let dynAttrs = {}

          if (meta?.selectable && curCriteria.matcher === CriteriaMatcherEnums.IN) {
            dynAttrs = { multiple: true }
          }
          if (meta?.type === ValueTypeEnums.DATE && curCriteria.matcher === CriteriaMatcherEnums.BETWEEN) {
            dynAttrs = { type: 'daterange' }
          }
          if (meta?.type === ValueTypeEnums.NUMBER) {
            dynAttrs = { type: 'number' }
          }

          return () => Object.assign(dynAttrs, propsAttrs)
        },
        meta: (index: number, attr?: string) => {
          const { fieldName } = conditionValue.singleCriterias[index] || {}

          const meta = metaMap.value.get(fieldName)
          if (meta) {
            return attr ? meta[attr as keyof typeof meta] : meta
          }

          return null
        },
        dynTrait: (index): 'select' | 'text' | 'date' | 'radio' | 'tags' | 'range' => {
          if (!index && index !== 0) {
            return 'text'
          }
          const curCriteria = conditionValue.singleCriterias[index]
          const meta = metaMap.value.get(curCriteria?.fieldName)

          // 3.1 当selectable 为true时，使用选择框（匹配类型为IN时多选）
          // 3.2当selectable 为false时，根据列数据类型区分：
          // 	BOOLEAN：开关
          // 	STRING：输入框（匹配条件为IN时用标签输入框）
          // 	NUMBER：数字数据框（匹配方式为BETWEEN时，输入组件为数字范围输入框）
          // 	DATE：日期输入框，精度到分钟（默认00：00），（匹配方式为BETWEEN时，输入组件为时间范围输入框，精确到日）
          // 	ENUM：选择框（匹配类型为IN时多选）
          if (meta?.selectable) {
            return 'select'
          }
          if (meta?.type === ValueTypeEnums.DATE) {
            return 'date'
          }
          if (meta?.type === ValueTypeEnums.BOOLEAN) { // TODO
            return 'radio'
          }
          if (meta?.type === ValueTypeEnums.ENUM) {
            return 'select'
          }
          if (meta?.type === ValueTypeEnums.STRING && curCriteria.matcher === CriteriaMatcherEnums.IN) {
            return 'tags'
          }
          if (curCriteria.matcher === CriteriaMatcherEnums.BETWEEN) {
            return 'range'
          }
          return 'text'
        },
        renderTag: (args: { option: { name: string }, handleClose: AnyFn }) => {
          return (
            <NTag closable onClose={() => args.handleClose()}>
              <span title={args.option.name}>{args.option.name}</span>
            </NTag>
          )
        },
        onPatternBlurCreator: (index: number) => (p: string) => {
          const values = (conditionValue.singleCriterias[index].values ??= [])

          if (!values?.includes(p) && p.trim()) {
            values.push(p)
          }
        },
        remove: (index: number) => () => {
          conditionValue.singleCriterias.splice(index, 1)
          criteriaIndex = 0
          initCriteria(criteriaValue.value)
        },
        clear: (index: number) => (v: string) => {
          // why I can't use formNode
          // const matcher = conditionContext.meta(index, 'matcherOptions')?.[0].value || 'EQ'
          const matcher = metaMap.value.get(v)?.supportMatchers?.[0]
          getNode(`${conditionValue.id}matcher${index}`)?.input(matcher)
          getNode(`${conditionValue.id}values${index}`)?.input(null)
        },
        batchAddCreator: (index: number) => () => {
          const curCriteria = conditionValue.singleCriterias[index]
          const meta = metaMap.value.get(curCriteria?.fieldName) || {} as CriteriaMeta
          props.onBatchAdd?.({
            meta,
            item: curCriteria,
          })
        },
        ...fkDebug(),
        ...(props.data || { }),
      }

      return (
        renderIf(showCriteria.value, () => [
          <n-card class={['pl-36px', 'relative', 'm-b-26px']} >
          <div class=":uno: absolute bottom-12px left-12px right-18px top-18px w-18px transition-height-2 flex-c_c" >
            {[
              <div class={[':uno: absolute bottom-0 left-50% top-0 w-2px -ml-1px ', logic.value === 'AND' ? 'bg-success' : 'bg-warning']} />,
              <NButton
                onClick={() => {
                  conditionValue.logic
                    = conditionValue.logic === 'AND' ? 'OR' : 'AND'
                  logic.value = conditionValue.logic
                  criteriaMap.get(conditionValue.id).logic = conditionValue.logic
                }}
                type={logic.value === 'AND' ? 'success' : 'warning'}
                size="tiny"
              >
                {logic.value === 'AND' ? '且' : '或'}
              </NButton>,
            ]}
          </div>

          <NButton v-show={!isRoot} type='warning' circle class=':uno: absolute right-4px top-4px h-14px w-14px' disabled={conditionValue.disabled} onClick={() => {
            removeGroup(criteriaValue.value.boolCriterias, conditionValue.id!)
            criteriaIndex = 0
            initCriteria(criteriaValue.value)
          }} >-</NButton>

          <FormKit
            type="form"
            actions={false}
            incomplete-message={false}
            v-model={conditionValue }
            config={{
              showLabel: false,
              labelPlacement: 'left',
            }}
          >
            {{
              default: () => [
                <FormKitSchema
                  library={library}
                  schema={schema.value}
                  data={conditionContext}
                ></FormKitSchema>,
              ],
            }}
          </FormKit>

          {renderIf(conditionValue.boolCriterias.length, () => conditionValue.boolCriterias.map(item => renderCondition(item)))}

          <n-space >
            <n-button type='primary' size='tiny' class='m-r-20px' onClick={() => {
              conditionValue.singleCriterias.push(createEmptyCondition(defaultField.value))
              criteriaIndex = 0
              initCriteria(criteriaValue.value)
            }}>添加条件</n-button>
            <n-button type='primary' size='tiny' onClick={() => {
              conditionValue.boolCriterias.push(createEmptyGroup(criteriaIndex + 1, defaultField.value))
              criteriaIndex = 0
              initCriteria(criteriaValue.value)
            }}>添加组</n-button>
          </n-space>

        </n-card>,
        ])

      )
    }

    return () => (
       <div class='relative p-b-30px'>
        {renderCondition(criteriaValue.value, true)}
        <n-space class='absolute bottom-10px right-0'>
          <n-button size='small' class='m-r-16px' onClick={() => {
            props.onCancel?.()
          }}>取消</n-button>
          <n-button type='primary' size='small' onClick={() => {
            emit('onUpdate:modelValue', criteriaValue.value)
            props.onSubmit?.(criteriaValue.value)
          }}>确定</n-button>
      </n-space>
       </div>
    )
  },
})
