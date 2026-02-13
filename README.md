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

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## VS Code Setup

Recommended extensions:
- Playwright Test for VS Code (ms-playwright.playwright)

## Scripts

- `npm test` - Run all tests
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
