import fs from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { getExternal, getGlobalDefines } from '@runafe/tools-build'
import MagicString from 'magic-string'

const isDev = process.env.DEV === 'true'

export default defineConfig({
  root: './',
  resolve: {
    alias: {
      ':': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    VueJsx(),
    {
      // vite always remove dist folder, I can not find methods to disable it.
      // In dev mode, I don't want to build type when file change, So, I copy it to dist folder to avoid it.
      name: 'vite:movelib',
      closeBundle: async () => {
        if (
          !fs.statSync('./dist', {
            throwIfNoEntry: false,
          })
        ) {
          fs.mkdirSync('./dist')
        }

        try {
          const code = new MagicString(
            fs.readFileSync('./node_modules/._dist/index.uno.js').toString(),
          )
          const style = fs
            .readFileSync('./node_modules/._dist/style.css')
            .toString()
          fs.writeFileSync('./dist/index.uno.js', code.toString())
          fs.writeFileSync('./dist/style.css', style)
        }
        catch (error) {
          console.error(error)
        }
      },
    },
  ],
  define: {
    __DEV__: isDev,
    ...getGlobalDefines(),
  },
  build: {
    outDir: './node_modules/._dist',
    minify: isDev,
    lib: {
      formats: ['es'],
      entry: 'src/index.ts',
      fileName: 'index.uno',
      name: 'MagicSystemAdmin',
    },
    rollupOptions: {
      external: (lib) => {
        return (
          getExternal('./').external(lib)
          || lib.includes('colord')
          || lib.startsWith('@formkit/')
        )
      },
    },
  },
})
