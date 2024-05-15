import path from 'node:path'
import type { Plugin } from 'vite'
import { getExternal } from '@runafe/tools-build'

// This plugin just dectect source code which include unocss code, So, mark it as **.uno.js, Which will be processed by unocss, Because, I want to keep unocss code pure and can be processed by user unocss config.
export default function (options: { unoFilesSet: Set<string> }): Plugin {
  let isBuild = true

  return {
    name: 'vite:unocss-dectection',
    enforce: 'pre',
    config: async (config, { command }) => {
      if (command !== 'build') {
        isBuild = false
      }
      if (isBuild) {
        config.build = {
          outDir: 'dist',
          lib: {
            formats: ['es', 'cjs'],
            entry: './src/index.ts',
            fileName: (m, name) => {
              const { unoFilesSet } = options
              const isUnoFile = [...unoFilesSet].some(n =>
                n.endsWith(`src/${name}`),
              )
              const ext = m === 'es' ? 'js' : 'cjs'

              if (name === 'index') {
                return `${name}.${ext}`
              }
              return `${m}/${name}.${isUnoFile ? 'uno.' : ''}${ext}`
            },
          },
          rollupOptions: {
            external: id =>
              !id.endsWith('.css') && getExternal('./').external(id),
            output: {
              exports: 'named',
            },
          },
        }
      }
      return config
    },
    configResolved: () => {
      if (!isBuild) {
        options.unoFilesSet.clear()
      }
    },
    transform(code, id) {
      if (isBuild) {
        const { unoFilesSet } = options
        const ext = path.extname(id)

        if (
          (ext === '.tsx' && !code.includes('@unocss-ignore'))
          || code.includes('@unocss-include')
          || ext === '.vue'
        ) {
          unoFilesSet.add(id.replace(ext, ''))
        }
      }
    },
  }
}
