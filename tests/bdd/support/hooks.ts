import { After, AfterStep, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import { getTestConfig } from '../../../src/config';
import type { CustomWorld } from './world';
import { EntityManager } from './EntityManager';

setDefaultTimeout(30000);

const config = getTestConfig();

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: config.headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.apiRequest = await request.newContext({
    baseURL: config.apiBaseUrl
  });
  
  // Initialize EntityManager with page and apiRequest
  this.entityManager = new EntityManager(this.page, this.apiRequest);
  
  // Reset test context for fresh state
  this.testContext.clear();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
  await this.apiRequest?.dispose();
});

AfterStep(async function (this: CustomWorld, { result, pickleStep, pickle }) {
  // Capture screenshots on failure OR if scenario is tagged with @screenshot
  const hasScreenshotTag = pickle?.tags?.some((tag: any) => tag.name === '@screenshot') ?? false;
  const shouldCapture = result?.status === Status.FAILED || hasScreenshotTag;

  if (!shouldCapture || !this.page) {
    return;
  }

  const screenshot = await this.page.screenshot({ fullPage: true });
  await this.attach(screenshot, 'image/png');
  await this.attach(`Current URL: ${this.page.url()}`, 'text/plain');

  if (result?.status === Status.FAILED) {
    await this.attach(`Failed step: ${pickleStep.text}`, 'text/plain');
  } else if (hasScreenshotTag) {
    await this.attach(`Screenshot captured: ${pickleStep.text}`, 'text/plain');
  }
});

