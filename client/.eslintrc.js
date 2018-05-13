'use strict'

// Put this file to the directory where your browser code is located. This could be the root
// directory, or a subdirectory if your project consists of both node.js and browser code.
module.exports = {
  extends: [
    '@strv/javascript/environments/react/v16',
    '@strv/javascript/environments/react/optional',
    '@strv/javascript/coding-styles/recommended',
  ],
  parserOptions: {
    sourceType: 'module'
  },
  parser: 'babel-eslint',
  // If you need to override some rules specifically for this project,
  // you can do so as usual via the rules property.
  // Per-project rules take precedence over rules defined via included
  // configurations.
  rules: {
    'valid-jsdoc': 2,
    'no-warning-comments': 0,
    'padded-blocks': 0,
    'id-length': [1, {
      min: 2,
      max: 35,
      exceptions: [
        'i',
        '_',
      ],
    }],
  },
}