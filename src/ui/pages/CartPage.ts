import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage represents the shopping cart page.
 * Provides access to cart items and checkout functionality.
 * Inherits header navigation from BasePage.
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get cart table rows containing items
   */
  cartRows(): Locator {
    return this.page.locator('tbody tr');
  }
}
