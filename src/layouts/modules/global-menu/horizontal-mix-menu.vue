<script setup lang="ts">
import { useMixMenuContext } from '../../hooks/use-mix-menu'
import FirstLevelMenu from './first-level-menu.vue'
import type { Menu } from ':/types'
import { useRouterPush } from ':/hooks/common/router'

defineOptions({
  name: 'HorizontalMixMenu',
})

const { activeFirstLevelMenuKey, setActiveFirstLevelMenuKey }
  = useMixMenuContext()
const { routerPushByKey } = useRouterPush()

function handleSelectMixMenu(menu: Menu) {
  setActiveFirstLevelMenuKey(menu.key)

  if (!menu.children?.length) {
    routerPushByKey(menu.routeKey)
  }
}
</script>

<template>
  <FirstLevelMenu
    :active-menu-key="activeFirstLevelMenuKey"
    @select="handleSelectMixMenu"
  >
    <slot />
  </FirstLevelMenu>
</template>

<style scoped></style>
