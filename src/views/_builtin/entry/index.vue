<script setup lang="ts">
import { useRouterPush } from ':/hooks/common/router'
import type { RouteKey } from ':/types'

const innerPages = ['403', '404', '500', 'entry'] as RouteKey[]
const routeCtx = useRouterPush()
</script>

<template>
  <rs-page>
    <NTag
      v-for="item in innerPages"
      :key="item"
      type="primary"
      class="mr-16px cursor-pointer"
      @click="() => routeCtx.routerPushByKey(item)"
    >
      {{ item }}
    </NTag>
  </rs-page>
</template>

<style scoped></style>
