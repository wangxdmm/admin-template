import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import dayjs from 'dayjs'
import { getExternal } from '@runafe/tools-build'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { setupUnplugin } from './unplugin'

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(
    configEnv.mode,
    process.cwd(),
  ) as unknown as Env.ImportMeta
  const buildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

  return {
    resolve: {
      alias: {
        ':': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      vueJsx(),
      ...setupUnplugin(viteEnv),
    ],
    define: {
      __DEV__: configEnv.mode === 'development',
      BUILD_TIME: JSON.stringify(buildTime),
    },
    build: {
      outDir: 'dist',
      minify: configEnv.mode === 'development',
      lib: {
        formats: ['es'],
        entry: 'src/index.tsx',
        fileName: 'index.uno',
        name: 'MagicSystemAdmin',
      },
      rollupOptions: {
        external: getExternal('./').external,
      },
    },
  }
})
