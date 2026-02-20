import { Page } from '@playwright/test';
import { Locator } from '@playwright/test';
import { getTestConfig } from '../../config';
import { Header } from '../elements/header_element';
import { Url } from 'url';

export abstract class BasePage {
  protected readonly page: Page;
  private readonly baseUrl: string;
  readonly header: Header;
  private readonly headerRoot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = getTestConfig().baseUrl;
    this.headerRoot = page.locator('app-header');
    this.header = new Header(this.headerRoot);
  }

  async goto(path = '/'): Promise<void> {
    const targetUrl =
      path.startsWith('http://') || path.startsWith('https://')
        ? path
        : new URL(path, this.baseUrl).toString();
    
    await this.page.goto(targetUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async isPageLoaded(): Promise<boolean> {
    await this.header.headerBadge.waitFor({ state: 'visible', timeout: 5000 });
    return this.header.headerBadge.isVisible();
  }
}
