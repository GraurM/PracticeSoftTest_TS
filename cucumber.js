module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/bdd/**/*.ts'],
    paths: ['tests/bdd/features/**/*.feature'],
    format: [
      'progress',
      'html:cucumber-report.html',
      'json:cucumber-report.json',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};