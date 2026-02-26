import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItemsTable: Locator;
  private readonly cartItemRows: Locator;
  private readonly updateButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly removeButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItemsTable = page.locator('.product-list table');
    this.cartItemRows = page.locator('.product-list table').locator('tbody').locator('tr');
    this.updateButton = page.getByRole('button', { name: /Update/ });
    this.checkoutButton = page.getByRole('link', { name: /Checkout/ }).first();
    this.removeButtons = page.locator('a[href*="remove="]');
  }

  async navigate(): Promise<void> {
    await this.goto('/index.php?rt=checkout/cart');
    await this.isPageLoaded();
  }

  async getCartItemCount(): Promise<number> {
    try {
      const rows = await this.cartItemRows.count();
      return rows;
    } catch {
      return 0;
    }
  }

  async getCartItemNames(): Promise<string[]> {
    const names: string[] = [];
    const rows = await this.cartItemRows.all();
    
    for (let i = 0; i < rows.length; i++) {
      const nameCell = rows[i].locator('td:nth-child(2)');
      const name = await nameCell.textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    return names;
  }

  async getTotalPrice(): Promise<string | null> {
    // Find the cell containing the total price (it's in the second table after "Total:" text)
    try {
      const totalCell = this.page.locator('table').nth(1).locator('td').filter({ hasText: /\$/ }).nth(2);
      return await totalCell.textContent();
    } catch {
      return null;
    }
  }

  async updateQuantity(itemIndex: number, quantity: number): Promise<void> {
    const quantityInput = this.cartItemRows.nth(itemIndex).locator('textbox').first();
    await quantityInput.clear();
    await quantityInput.fill(quantity.toString());
  }

  async clickUpdate(): Promise<void> {
    await this.updateButton.click();
  }

  async removeItem(itemIndex: number): Promise<void> {
    await this.removeButtons.nth(itemIndex).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  getPage(): Page {
    return this.page;
  }
}
