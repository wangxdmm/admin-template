import { zh } from '@formkit/i18n'
import { defaultConfig } from '@formkit/vue'
import { createNaivePlugin } from '@runafe/formkit-naive-ui'

export default defaultConfig({
  rules: {},
  locales: { zh },
  locale: 'zh',
  plugins: [createNaivePlugin()],
})
