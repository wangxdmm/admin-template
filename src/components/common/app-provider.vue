<script setup lang="ts">
import { createTextVNode, defineComponent } from 'vue'
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'

defineOptions({
  name: 'AppProvider',
})

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      globalThis.$loadingBar = useLoadingBar()
      globalThis.$dialog = useDialog()
      globalThis.$message = useMessage()
      globalThis.$notification = useNotification()
    }

    register()

    return () => createTextVNode()
  },
})
</script>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <ContextHolder />
          <slot />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<style scoped></style>
