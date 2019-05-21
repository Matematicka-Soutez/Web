
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
  // If you need to override some rules specifically for this project,
  // you can do so as usual via the rules property.
  // Per-project rules take precedence over rules defined via included
  // configurations.
  rules: {
    'no-warning-comments': 0,
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
  },
  overrides: [{
    // Little different rules for tests
    files: ['*.spec.js', '*.test.js'],
    env: {
      mocha: true
    },
    settings: {
      // import/name rule does not recognize named exports from chai module (rule is disabled for chai file only)
      'import/ignore': [
        './core/chai'
      ]
    },
    rules: {
      'max-len': 0,
      'prefer-arrow-callback': 0,
    }
  }, {
    // Little different rules for database models
    files: ['api/src/database/models/*'],
    rules: {
      'max-len': 0,
      'new-cap': 0,
    }
  }, {
    // Little different rules for scripts
    files: ['scripts/*'],
    rules: {
      'no-console': 0,
    }
  }]
}
