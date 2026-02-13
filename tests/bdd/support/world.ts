import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type { APIRequestContext, Browser, BrowserContext, Page } from '@playwright/test';
import { EntityManager } from './EntityManager';
import { Context } from './Context';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiRequest?: APIRequestContext;
  entityManager?: EntityManager;
  testContext: Context;

  constructor(options: IWorldOptions) {
    super(options);
    this.testContext = new Context();
  }
}

setWorldConstructor(CustomWorld);
