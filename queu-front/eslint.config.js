import js from '@eslint/js'
import nextConfig from 'eslint-config-next'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config} */
export default [
  js.configs.recommended,
  nextConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Não usar ponto e vírgula
      semi: ['error', 'never'],

      // Usar aspas simples
      quotes: ['error', 'single'],

      // Variáveis não utilizadas apenas como aviso
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // Permitir console
      'no-console': 'off',

      // Outras regras úteis
      'prefer-const': 'error',
      'no-var': 'error',

      // React rules
      'react/react-in-jsx-scope': 'off', // Next.js não precisa importar React
      'react/prop-types': 'off', // Usando TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig, // Deve ser o último para desabilitar regras conflitantes
]
