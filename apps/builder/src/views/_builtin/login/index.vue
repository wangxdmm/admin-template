<script lang="ts" setup>
import { sys_store } from '@runafe/easy-admin'
import { toRaw } from 'vue'
import { useLoading } from '@runafe/magic-system'
import particlesConfig from './pt.json'
import pic from './pic.png'

const loginLoading = useLoading()

const schema = ref([
  {
    $formkit: 'n:text',
    label: '用户名',
    name: 'username',
    validation: 'required',
    autofocus: true,
    onKeyup: (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submit()
      }
    },
  },
  {
    $formkit: 'n:password',
    label: '密码',
    name: 'password',
    validation: 'required',
    onKeyup: (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submit()
      }
    },
  },
]) as Ref<any>

const model = reactive({
  username: '',
  password: '',
  grant_type: 'password',
  client_id: 'web',
  client_secret: 'web-secret',
})

async function submit() {
  loginLoading
    .with(async () => {
      await sys_store.stores.auth()?.login(toRaw(model))
    })
    .call()
}
</script>

<template>
  <div class="size-full flex-c_c relative">
    <vue-particles
      id="tsparticles"
      :options="particlesConfig"
      class="size-full absolute"
    />
    <div class="size-300px">
      <RsPlainCard content-class="p-16px!">
        <FormKit
          v-model="model"
          type="form"
          :actions="false"
          :incomplete-message="false"
          @submit="submit"
        >
          <template #default="ctx">
            <h2 class="h-32px flex-c_c mb-16px">
              <img :src="pic" class="size-26px mr-8px">
              <span class="text-18px font-600 tracking-wide">{{
                sys_store.config.value.title
              }}</span>
            </h2>
            <FormKitSchema :schema="schema" />
            <div class="flex-e_c">
              <NButton
                class="flex-1"
                type="primary"
                :disabled="!ctx.state.valid"
                :loading="loginLoading.ref"
                @click="() => ctx.node.submit()"
              >
                登录
              </NButton>
            </div>
          </template>
        </FormKit>
      </RsPlainCard>
    </div>
  </div>
</template>
