import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.git/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        global: 'writable'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
]
