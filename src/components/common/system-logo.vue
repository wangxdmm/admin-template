<script lang="ts" setup>
import { sys_store } from ':/global'

defineOptions({ name: 'SystemLogo' })
</script>

<template>
  <!-- <IconLocalLogo /> -->
  <div class="size-26px">
    <img class="size-full" :src="sys_store.config.value.logo">
  </div>
</template>

<style scoped></style>
