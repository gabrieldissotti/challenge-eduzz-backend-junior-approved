module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    it: 'readonly',
    describe: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    "class-methods-use-this": "off",
    "camelcase": "off",
    "@typescript-eslint/camelcase": "off",
    "no-param-reassign": "off",
    "semi": "off",
    "comma-dangle": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  }
}
