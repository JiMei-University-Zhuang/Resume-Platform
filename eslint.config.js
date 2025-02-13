import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import typescript from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,vue}'],
    languageOptions: {
      parser: typescript,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue: vue
    },
    rules: {}
  }
]
