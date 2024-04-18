import { defineConfig } from '@unocss/vite'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import presetUno from '@unocss/preset-uno'
import type { Theme } from '@unocss/preset-uno'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import transformerCompileClass from '@unocss/transformer-compile-class'
import { defineSubStyleTransformer, presetFlexTricks } from 'unocss-tricks'
import { presetAttributify } from 'unocss'
import { presetSoybeanAdmin } from './uno-preset'
import { themeVars } from './src/theme/vars'

export default defineConfig<Theme>({
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        /\.uno.js/,
      ],
    },
  },
  theme: {
    ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      'icon': '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem',
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',
  },
  transformers: [
    defineSubStyleTransformer(),
    transformerDirectives(),
    transformerVariantGroup(),
    transformerCompileClass(),
    transformerAttributifyJsx(),
  ],
  presets: [
    presetUno({ dark: 'class' }),
    presetSoybeanAdmin(),
    presetAttributify(),
    presetFlexTricks(),
  ],
})
