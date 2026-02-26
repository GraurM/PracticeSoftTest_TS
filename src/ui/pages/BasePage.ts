import { Page, Locator } from '@playwright/test';
import { getTestConfig } from '../../config';
import { HeaderElement } from '../elements/HeaderElement';
import { NavigationBarElement } from '../elements/NavigationBarElement';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;
  readonly header: HeaderElement;
  readonly currencyDropdown: Locator; 
  readonly cartDropdown: Locator;
  readonly navBar: NavigationBarElement;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = getTestConfig().baseUrl;
    this.header = new HeaderElement(page.locator('header'));
    this.currencyDropdown = page.locator('ul.language');
    this.cartDropdown = page.locator('ul.topcart');
    this.navBar = new NavigationBarElement(page.locator('nav.subnav'));
  }

  async goto(path = ''): Promise<void> {
    const pathToGo = path === '' ? '/' : path;
    const targetUrl =
      pathToGo.startsWith('http://') || pathToGo.startsWith('https://')
        ? pathToGo
        : new URL(pathToGo, this.baseUrl).toString();

    await this.page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
  }

  async isPageLoaded(): Promise<boolean> {
    await this.header.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    return this.header.pageTitle.isVisible();
  }

  async selectCurrency(currency: string): Promise<void> {
    await this.currencyDropdown.click();
    const currencyOption = this.currencyDropdown.locator(`li:has-text("${currency}")`);
    await currencyOption.click();
  }
}
