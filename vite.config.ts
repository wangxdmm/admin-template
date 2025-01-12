import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { getGlobalDefines } from '@runafe/tools-build'
import noBundlePlugin from 'vite-plugin-no-bundle'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import UnocssDetection from './_share/build/unocss-detection'

const isDev = process.env.DEV === 'true'
const unoFilesSet = new Set<string>()

export default defineConfig({
  root: './',
  resolve: {
    alias: [
      {
        find: ':',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  plugins: [
    vue(),
    VueJsx(),
    UnocssDetection({
      unoFilesSet,
    }),
    noBundlePlugin(),
    cssInjectedByJsPlugin({
      styleId: 'runafe_easy_admin_css_injected_by_js',
    }),
  ],
  define: {
    __DEV__: isDev,
    ...getGlobalDefines(),
  },
})
