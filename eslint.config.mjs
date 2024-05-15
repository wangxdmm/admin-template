import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    unocss: true,
    vue: true,
    rules: {
      'curly': [2, 'all'],
      'unused-imports/no-unused-imports-ts': 'error',
    },
    stylistic: {
      jsx: false,
    },
  },
  {
    ignores: [
      '**/dist',
      '**/temp',
      '**/volar.d.ts',
      '**/elegant',
      '**/dist-lib',
      '**/env.d.ts',
    ],
  },
)
