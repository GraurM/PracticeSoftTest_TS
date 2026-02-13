import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductPage represents a single product details page.
 * Provides access to product information and add-to-cart functionality.
 * Inherits header navigation from BasePage.
 */
export class ProductPage extends BasePage {
  readonly productHeading: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productHeading = page.getByRole('heading', { level: 1 });
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
  }

  /**
   * Add the product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
