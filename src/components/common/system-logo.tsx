import { computed, defineComponent, markRaw, toValue } from 'vue'
import { isString } from '@monan/shared'
import { APP_INST } from ':/global'

export default defineComponent({
  name: 'SystemLogo',
  setup() {
    const logo = computed(() => {
      const v = toValue(APP_INST.config.global.logo)

      return isString(v) ? <img src={v}></img> : markRaw(v)
    })

    return () => {
      return <div class="size-26px">{logo.value}</div>
    }
  },
})
