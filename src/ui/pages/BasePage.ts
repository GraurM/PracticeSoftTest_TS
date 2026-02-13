import { Page } from '@playwright/test';
import { Locator } from '@playwright/test';
import { Header } from '../elements/header';

export abstract class BasePage {
  protected readonly page: Page;
  private readonly baseUrl: string;
  readonly header: Header;
  private readonly headerRoot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL ?? 'https://practicesoftwaretesting.com';
    this.headerRoot = page.locator('app-header');
    this.header = new Header(this.headerRoot);
  }

  async goto(path = '/'): Promise<void> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      await this.page.goto(path);
      return;
    }

    const targetUrl = new URL(path, this.baseUrl).toString();
    await this.page.goto(targetUrl);
  }
}
