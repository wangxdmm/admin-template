import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { moveFile } from 'move-file'

const dir = dirname(fileURLToPath(import.meta.url))

fg.globSync('**/*.d.ts', {
  cwd: resolve(dir, '../temp/src'),
}).forEach((file) => {
  const sourceDts = resolve(dir, '../temp/src', file)
  const dtsFile = resolve(dir, '../dist/es', file)

  moveFile(sourceDts, dtsFile)
})
