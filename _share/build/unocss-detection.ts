import path from 'node:path'
import fs from 'node:fs'
import type { Plugin } from 'vite'
import { getExternal } from '@runafe/tools-build'
import consola from 'consola'

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
              const ext = m === 'es' ? 'js' : 'cjs'

              return `${m}/${name}.${ext}`
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

        if (ext === '.tsx' && !code.includes('@unocss-ignore')) {
          unoFilesSet.add(id.replace(ext, ''))
        }
      }
    },
    closeBundle: () => {
      if (isBuild) {
        // // for vue SFC will generate style, template empty files, like xx.vue.uno2.js uno3.js so use this to remove them
        // rimrafSync('dist/**/*.{vue2,vue3}.js', {
        //   glob: true,
        // })
        ;[...options.unoFilesSet].forEach((file) => {
          const path = `dist/es/${file.split('src/')[1]}.js`
          const content = `//@unocss-include\n${fs.readFileSync(path)}`
          fs.writeFileSync(path, content)
          consola.success(`Marked ${path} as unocss file.`)
        })
      }
    },
  }
}
