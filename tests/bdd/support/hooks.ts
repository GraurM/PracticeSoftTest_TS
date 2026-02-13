import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import type { CustomWorld } from './world';
import { EntityManager } from './EntityManager';

setDefaultTimeout(30000);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.apiRequest = await request.newContext({
    baseURL: process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com'
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

