import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly productLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.productLinks = page.getByRole('link').filter({ has: page.locator('[href*="product_id="]') });
  }

  async navigate(): Promise<void> {
    await this.goto('/');
  }

  async clickProductByName(productName: string): Promise<void> {
    const productLink = this.page.getByRole('link', { name: productName }).first();
    await productLink.click();
  }

  async getCartItemCount(): Promise<string> {
    const cartText = await this.header.cartLink.textContent();
    // Extract number from "X Items - $Y.YY" format
    const match = cartText?.match(/(\d+)\s+Items/);
    return match ? match[1] : '0';
  }

  async filterByCategory(categoryName: string): Promise<void> {
    await this.navBar.navigateToCategory(categoryName);
  }

  async getProductCards(): Promise<Locator[]> {
    // Get all product name links which have product_id parameter
    const cards = await this.page.getByRole('link').filter({ has: this.page.locator('[href*="product_id="]') }).all();
    return cards;
  }

  getPage(): Page {
    return this.page;
  }
}
