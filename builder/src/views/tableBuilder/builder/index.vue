<script lang="ts" setup>
const show = ref(false)
</script>

<template>
  <div class="relative size-full p-16px">
    <div class="flex-s_c gap-16px">
      <NButton
        size="medium"
        type="primary"
        @click="
          () => {
            show = true
          }
        "
      >
        保存
      </NButton>
      <NButton type="primary">
        发布
      </NButton>
    </div>
    <div>schema</div>
    <div class="absolute right-0 top-4px bottom-4px">
      <RsPlainCard content-class="w-400px p-16px!">
        <p>设计</p>
      </RsPlainCard>
    </div>
  </div>
</template>
