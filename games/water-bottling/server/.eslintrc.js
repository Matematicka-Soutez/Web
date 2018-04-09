
module.exports = {
  // The extends directive allows composition of configuration files
  extends: [
    '@strv/javascript/environments/nodejs/optional',
    '@strv/javascript/environments/nodejs/v8',
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
    'padded-blocks': 0,
    'id-length': [1, {
      min: 2,
      max: 35,
      exceptions: [
        'i',
        '_',
      ],
    }],
  }
}
