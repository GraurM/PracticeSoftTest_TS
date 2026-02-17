import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { checkoutGrid } from '../elements/checkoutGrid_element';
import { checkoutSteps } from '../elements/checkoutSteps_element';

/**
 * CartPage represents the shopping cart page.
 * Provides access to cart items and checkout functionality.
 * Inherits header navigation from BasePage.
 */
export class CartPage extends BasePage {

  readonly stepPosition: checkoutSteps;
  readonly checkoutGrid: checkoutGrid;
  readonly continueShoppingButton: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.stepPosition = new checkoutSteps(page.locator('aw--wizard-navigation-bar'));
    this.checkoutGrid = new checkoutGrid(page.locator('table'));
    this.continueShoppingButton = page.getByRole('button', { name: /continue shopping/i });
    this.proceedToCheckoutButton = page.getByRole('button', { name: /proceed to checkout/i });
  }

  /**
   * Get cart table rows containing items
   */
  cartRows(): Locator {
    return this.checkoutGrid.rows;
  }
}
