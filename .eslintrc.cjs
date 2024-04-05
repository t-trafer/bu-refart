module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['dist'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  overrides: [
    {
      files: ['vite.config.ts'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
  plugins: ['@typescript-eslint', 'react', 'react-refresh'],
  rules: {
    /* react refresh - DO NOT REMOVE */
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    /* vite */
    // vite requires public paths to be accessed via absolute paths
    'import/no-absolute-path': 0,

    /* prettier */
    // can-not be multi-line/multi-or-nest
    curly: ['error', 'multi'],
    // with allowIndentationTabs as true, no-tabs takes care of tabs while Prettier takes care of indentation
    'no-tabs': ['error', { allowIndentationTabs: true }],
    // singleQuote on prettier must match with this config
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: false,
      },
    ],
    // deny all confusing sequenced expressions
    'no-restricted-syntax': [
      'error',
      {
        selector: 'SequenceExpression',
        message:
          "The comma operator is confusing and a common mistake. Don't use it!",
      },
    ],
    'no-restricted-exports': [
      'error',
      {
        restrictDefaultExports: {
          direct: false,
          named: false,
          defaultFrom: false,
          namedFrom: false,
          namespaceFrom: false,
        },
      },
    ],
    'import/no-unresolved': 2,
  },
};
