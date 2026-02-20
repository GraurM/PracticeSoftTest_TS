module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/bdd/**/*.ts'],
    paths: ['tests/bdd/features/ui/**/*.feature'],
    format: [
      'progress',
      'html:cucumber-report.html',
      'json:cucumber-report.json',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      resultsDir: 'allure-results',
    },
    parallel: 1,
  },
};
