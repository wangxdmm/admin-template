import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { moveFile } from 'move-file'

const __dirname = dirname(fileURLToPath(import.meta.url))

fg.globSync('**/*.d.ts', {
  cwd: resolve(__dirname, '../temp/src'),
}).forEach((file) => {
  const sourceDts = resolve(__dirname, '../temp/src', file)
  const dtsFile = resolve(__dirname, '../dist/es', file)

  moveFile(sourceDts, dtsFile)
})
