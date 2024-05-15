import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $, type Options } from 'execa'

const __dirname = dirname(fileURLToPath(import.meta.url))
const options: Options = {
  cwd: resolve(__dirname, '../'),
  stdio: 'inherit',
}

export const $$ = $(options)
