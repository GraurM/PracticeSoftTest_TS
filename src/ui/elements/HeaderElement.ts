import { Page, Locator } from '@playwright/test';

export class HeaderElement {
  private readonly root: Locator;
  readonly pageTitle: Locator;
  readonly logRegisterLink: Locator;
  readonly specialsLink: Locator;
  readonly accountLink: Locator;
  readonly cartLink: Locator;
  readonly checkoutLink: Locator;

  readonly searchInput: Locator;
  readonly searchButton: Locator;     

    constructor(root: Locator) {
    this.root = root;
    this.pageTitle = this.root.locator('.navbar-header');
    this.logRegisterLink = this.root.locator("#customer_menu_top a");
    this.specialsLink = this.root.locator(".menu_specials");
    this.accountLink = this.root.locator(".menu_account");
    this.cartLink = this.root.locator(".menu_cart");
    this.checkoutLink = this.root.locator(".menu_checkout");
    this.searchInput = this.root.locator('#filter_keyword');
    this.searchButton = this.root.locator(".button-in-search");
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }
}