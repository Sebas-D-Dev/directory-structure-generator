import { FlatCompat } from '@eslint/eslintrc'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import a11yPlugin from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

const compat = new FlatCompat()

const config = [
  {
    // Add files to ignore here. This solves the "module is not defined" error for config files.
    ignores: ['tailwind.config.js', 'postcss.config.js'],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'jsx-a11y': a11yPlugin,
      prettier: prettierPlugin,
    },
  },
  prettierConfig,
];

export default config;
