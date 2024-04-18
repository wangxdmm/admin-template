<script lang="ts" setup>
const builder = 'bilibili'
</script>

<template>
  <RsPage>
    <template #tree>
      <RsPlainCard> tree </RsPlainCard>
    </template>
    <RsPlainCard>
      {{ builder }}
    </RsPlainCard>
  </RsPage>
</template>
