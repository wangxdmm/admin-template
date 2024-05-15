import { resolve } from 'node:path'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'
import ts from 'typescript'
import { rimrafSync } from 'rimraf'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'

const { ModuleResolutionKind } = ts

export default defineConfig({
  input: resolve('./temp/src/index.d.ts'),
  plugins: [
    tsConfigPaths({
      tsConfigPath: resolve('./temp/tsconfig.json'),
    }),
    dts({
      tsconfig: resolve('./temp/tsconfig.json'),
      compilerOptions: {
        composite: false,
        moduleResolution: ModuleResolutionKind.Bundler,
        tsBuildInfoFile: '',
      },
    }),
    {
      name: 'clear-temp',
      closeBundle: () => {
        // TODO ? why not work sync
        setTimeout(() => {
          try {
            rimrafSync(resolve('./temp'))
          }
          catch (error) {}
        }, 1000)
      },
    },
  ],
  output: {
    file: './dist/index.d.ts',
    format: 'es',
  },
})
