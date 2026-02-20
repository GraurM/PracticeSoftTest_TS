import { Page } from '@playwright/test';
import { Locator } from '@playwright/test';
import { getTestConfig } from '../../config';
import { Header } from '../elements/header_element';

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
    if (path.startsWith('http://') || path.startsWith('https://')) {
      await this.page.goto(path);
      return;
    }

    const targetUrl = new URL(this.baseUrl + path).toString();
    await this.page.goto(targetUrl);
  }

  async isPageLoaded(): Promise<boolean> {
    return this.header.headerBadge.isVisible();
  }
}
