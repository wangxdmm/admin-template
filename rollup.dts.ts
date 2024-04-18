import { resolve } from 'node:path'
import { defineRollupConfig } from '@runafe/tools-build'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'

export default defineRollupConfig({
  plugins: {
    dts: [
      tsConfigPaths({
        tsConfigPath: resolve('./temp/tsconfig.json'),
      }),
    ],
  },
  tsconfig: resolve('./temp/tsconfig.json'),
  dtsOnly: true,
  dtsInput: resolve('./temp/src/index.d.ts'),
})
