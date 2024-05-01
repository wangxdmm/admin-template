<script setup lang="ts">
import { computed } from 'vue'
import type { VNode } from 'vue'
import { useDialog } from '@runafe/magic-system'
import { useSvgIconRender } from ':/hooks'
import { useAuthStore } from ':/store/modules/auth'
import { useRouterPush } from ':/hooks'
import { $t } from ':/locales'
import SvgIcon from ':/components/custom/svg-icon.vue'

defineOptions({
  name: 'UserAvatar',
})

const authStore = useAuthStore()
const { toLogin } = useRouterPush()
const { SvgIconVNode } = useSvgIconRender(SvgIcon)
const dialog = useDialog()

function loginOrRegister() {
  toLogin()
}

type DropdownKey = 'user-center' | 'logout'

type DropdownOption =
  | {
    key: DropdownKey
    label: string
    icon?: () => VNode
  }
  | {
    type: 'divider'
    key: string
  }

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.userCenter'),
      key: 'user-center',
      icon: SvgIconVNode({ icon: 'pajamas:user', fontSize: 18 }),
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 }),
    },
  ]

  return opts
})

function logout() {
  dialog.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    ok: () => {
      authStore.resetStore(true)
      return Promise.resolve(true)
    },
  })
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout()
  }
  // else
  //   routerPushByKey(key)
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown
    v-else
    placement="bottom"
    trigger="click"
    :options="options"
    @select="handleDropdown"
  >
    <!-- <div class="cursor-pointer gap-8px flex-e_c">
       <SvgIcon icon="pajamas:user" />
     <span class="text-14px font-medium">{{ authStore.userInfo.realName }}</span>
    </div>  -->
    <n-avatar
      round
      size="small"
      class="cursor-pointer bg-primary text-primary-100"
    >
      {{ authStore.userInfo.realName }}
    </n-avatar>
  </NDropdown>
</template>

<style scoped></style>
