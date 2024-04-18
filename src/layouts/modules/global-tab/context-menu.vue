<script setup lang="ts">
import { computed } from 'vue'
import type { VNode } from 'vue'
import { useSvgIconRender } from ':/global-hooks/src'
import { $t } from ':/locales'
import { useTabStore } from ':/store/modules/tab'
import SvgIcon from ':/components/custom/svg-icon.vue'
import type { DropdownKey } from ':/types'

defineOptions({
  name: 'ContextMenu',
})

const props = withDefaults(defineProps<Props>(), {
  excludeKeys: () => [],
  disabledKeys: () => [],
})

interface Props {
  /** ClientX */
  x: number
  /** ClientY */
  y: number
  tabId: string
  excludeKeys?: DropdownKey[]
  disabledKeys?: DropdownKey[]
}

const visible = defineModel<boolean>('visible')

const { removeTab, clearTabs, clearLeftTabs, clearRightTabs } = useTabStore()
const { SvgIconVNode } = useSvgIconRender(SvgIcon)

interface DropdownOption {
  key: DropdownKey
  label: string
  icon?: () => VNode
  disabled?: boolean
}

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'closeCurrent',
      label: $t('dropdown.closeCurrent'),
      icon: SvgIconVNode({ icon: 'ant-design:close-outlined', fontSize: 18 }),
    },
    {
      key: 'closeOther',
      label: $t('dropdown.closeOther'),
      icon: SvgIconVNode({
        icon: 'ant-design:column-width-outlined',
        fontSize: 18,
      }),
    },
    {
      key: 'closeLeft',
      label: $t('dropdown.closeLeft'),
      icon: SvgIconVNode({
        icon: 'mdi:format-horizontal-align-left',
        fontSize: 18,
      }),
    },
    {
      key: 'closeRight',
      label: $t('dropdown.closeRight'),
      icon: SvgIconVNode({
        icon: 'mdi:format-horizontal-align-right',
        fontSize: 18,
      }),
    },
    {
      key: 'closeAll',
      label: $t('dropdown.closeAll'),
      icon: SvgIconVNode({ icon: 'ant-design:line-outlined', fontSize: 18 }),
    },
  ]
  const { excludeKeys, disabledKeys } = props

  const result = opts.filter(opt => !excludeKeys.includes(opt.key))

  disabledKeys.forEach((key) => {
    const opt = result.find(item => item.key === key)

    if (opt) {
      opt.disabled = true
    }
  })

  return result
})

function hideDropdown() {
  visible.value = false
}

const dropdownAction: Record<DropdownKey, () => void> = {
  closeCurrent() {
    removeTab(props.tabId)
  },
  closeOther() {
    clearTabs([props.tabId])
  },
  closeLeft() {
    clearLeftTabs(props.tabId)
  },
  closeRight() {
    clearRightTabs(props.tabId)
  },
  closeAll() {
    clearTabs()
  },
}

function handleDropdown(optionKey: DropdownKey) {
  dropdownAction[optionKey]?.()
  hideDropdown()
}
</script>

<template>
  <NDropdown
    :show="visible"
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options as TODO"
    @clickoutside="hideDropdown"
    @select="handleDropdown"
  />
</template>

<style scoped></style>
