import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import dayjs from 'dayjs'
import { setupVitePlugins } from './build'

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(
    configEnv.mode,
    process.cwd(),
  ) as unknown as Env.ImportMeta
  const buildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        ':': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: setupVitePlugins(viteEnv),
    define: {
      __DEV__: configEnv.mode === 'development',
      BUILD_TIME: JSON.stringify(buildTime),
    },
    server: {
      host: '0.0.0.0',
      port: 6050,
      proxy: {
        '/v4.0': {
          target: 'http://192.168.1.65',
          changeOrigin: true,
          ws: true,
        },
      },
      fs: {
        cachedChecks: false,
      },
    },
    preview: {
      port: 7060,
    },
    optimizeDeps: {
      // TODO extract uno css file
      include: [
        '@formkit/core',
        '@formkit/vue',
        'xe-utils',
        'vxe-table',
        'grid-layout-plus',
        'file-saver',
        'js-file-downloader',
        'md5',
      ],
      exclude: ['@runafe/magic-system', '@runafe/formkit-naive-ui'],
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})