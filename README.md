# Playwright TypeScript Testing Project

A modern testing framework project using Playwright and TypeScript for end-to-end testing across multiple browsers.

## Project Overview

This project provides a structured setup for automated testing using:
- **Playwright**: Multi-browser testing library
- **TypeScript**: Strong typing and better developer experience
- **Modern ESM/CommonJS**: Support for modern JavaScript features

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
.
├── tests/                 # Test files
│   └── example.spec.ts   # Example test specification
├── src/                   # Utility functions and helpers
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Debug tests
```bash
npm run test:debug
```

### Generate test code with Codegen
```bash
npm run codegen
```

## Configuration

Edit [playwright.config.ts](playwright.config.ts) to:
- Configure test timeouts
- Set up different browser configurations
- Configure reporters
- Add base URL for your application

Centralized test configuration is stored in [config/test-config.json](config/test-config.json).
This file is loaded into environment variables at runtime, allowing all test components to access unified settings.

Supported configuration values in the JSON file:
- `BASE_URL` (default: `https://practicesoftwaretesting.com`) - UI base URL
- `API_BASE_URL` (default: `https://api.practicesoftwaretesting.com`) - API base URL
- `HEADLESS` (default: `true`) - Browser headless mode (accepts `true/false`, `1/0`, `yes/no`, `on/off`)

Note: Environment variables override JSON config values if they are set externally.

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Generate and open the Allure report for BDD runs:
```bash
npm run test:allure
npm run allure:open
```

## CI/CD Pipelines

GitHub Actions workflows automatically run tests and generate reports. Three pipelines are configured:

### `all-tests.yml`
Runs on every push to `main`/`develop` and on all pull requests:
- Executes both BDD and Playwright test suites
- Generates Allure reports for BDD tests
- Publishes reports to GitHub Pages (main branch only)
- Runs on Node 20.x

### `test.yml`
Manual workflow trigger (workflow_dispatch) for BDD tests:
- Runs on Node 18.x and 20.x
- Configurable headless mode via workflow input
- Generates Allure reports
- Uploads artifacts for 30 days

### `playwright.yml`
Manual workflow trigger for Playwright tests:
- Runs on Node 18.x and 20.x
- Configurable browser selection
- Uploads HTML reports as artifacts
- Comments on PRs with results

To manually trigger workflows, use GitHub Actions tab → select workflow → "Run workflow" button.

## VS Code Setup

Recommended extensions:
- Playwright Test for VS Code (ms-playwright.playwright)

## Scripts

- `npm test` - Run all tests
- `npm run test:allure` - Run BDD tests and generate Allure results/report
- `npm run allure:generate` - Generate Allure HTML report from `allure-results`
- `npm run allure:open` - Open generated Allure report
- `npm run test:ui` - Run tests in interactive UI mode
- `npm run test:debug` - Debug tests with Inspector
- `npm run codegen` - Generate test code using Codegen
- `npm run build` - Compile TypeScript
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Documentation

- [Playwright Official Docs](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)

## License

MIT
