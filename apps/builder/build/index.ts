import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import progress from 'vite-plugin-progress'
import Inspect from 'vite-plugin-inspect'
import { setupElegantRouter } from './router'
import { setupUnocss } from './unocss'
import { setupUnplugin } from './unplugin'

export function setupVitePlugins(viteEnv: Env.ImportMeta) {
  const plugins: PluginOption = [
    Inspect(),
    vue({
      script: {
        defineModel: true,
      },
    }),
    vueJsx(),
    setupElegantRouter(viteEnv),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress(),
  ]

  return plugins
}