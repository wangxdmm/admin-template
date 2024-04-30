<script setup lang="ts">
import { tableHelp } from '@runafe/magic-system'

const text = Object.values(tableHelp).join('')
</script>

<template>
  <rs-page>
    <rs-plain-card>
      <n-scrollbar>
        <pre>
        {{ text }}
      </pre>
      </n-scrollbar>
    </rs-plain-card>
  </rs-page>
</template>

<style></style>
