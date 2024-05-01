<script setup lang="ts">
import { tableHelp } from '@runafe/magic-system'

const text = Object.values(tableHelp)
</script>

<template>
  <rs-page>
    <rs-plain-card>
      <n-scrollbar>
        <div class="flex-s_c_col gap-16px p-16px">
          <rs-plain-card v-for="item in text" :key="item" content-class="p-16px" embedded>
            <pre>{{ item }}</pre>
          </rs-plain-card>
        </div>
      </n-scrollbar>
    </rs-plain-card>
  </rs-page>
</template>

<style></style>
