import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.DS_Store',
      '*.log',
      '*.local',
      'public/**',
      '.env*',
      '*.d.ts',
      '*.config.js',
      'vite.config.*'
    ]
  },
  
  eslint.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx}'],
    languageOptions: {
      globals: {
        File: true,
        FormData: true,
        console: true,
        document: true,
        window: true,
        navigator: true,
        fetch: true,
        URL: true
      },
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },
  
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        File: true,
        FormData: true,
        console: true,
        document: true,
        window: true,
        navigator: true
      },
      parser: vueParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tsparser
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue: vue
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
]
