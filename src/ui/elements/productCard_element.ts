import { Locator } from '@playwright/test';

/**
 * ProductCard element represents a single product in the grid on HomePage.
 * Contains image, name, CO2 grade, price, stock status, and interaction methods.
 */
export class ProductCard {
  private readonly card: Locator;

  readonly image: Locator;
  readonly name: Locator;
  readonly coGrade: Locator;
  readonly price: Locator;
  readonly outOfStockBadge: Locator;

  constructor(card: Locator) {
    this.card = card;
    this.image = this.card.locator('img').first();
    this.name = this.card.locator('h4, h3, h2, a').first();
    this.coGrade = this.card.locator('text=/^[A-E]$/').first();
    this.price = this.card.locator('text=/\\$/').first();
    this.outOfStockBadge = this.card.locator('text=/out of stock/i');
  }

  /**
   * Get the product name text
   */
  async getName(): Promise<string> {
    try {
      return (await this.name.textContent()) ?? '';
    } catch {
      return '';
    }
  }

  /**
   * Get the price text
   */
  async getPrice(): Promise<string> {
    try {
      return (await this.price.textContent()) ?? '';
    } catch {
      return '';
    }
  }

  /**
   * Check if the product is out of stock
   */
  async isOutOfStock(): Promise<boolean> {
    try {
      return await this.outOfStockBadge.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get the CO2 grade text
   */
  async getCOGrade(): Promise<string> {
    try {
      return (await this.coGrade.textContent()) ?? '';
    } catch {
      return '';
    }
  }

  /**
   * Click on the product card to open details
   */
  async click(): Promise<void> {
    await this.card.click();
  }

  /**
   * Check if the card is visible
   */
  async isVisible(): Promise<boolean> {
    return this.card.isVisible();
  }

  /**
   * Get the product image src
   */
  async getImageSrc(): Promise<string | null> {
    try {
      return await this.image.getAttribute('src');
    } catch {
      return null;
    }
  }

  /**
   * Get the underlying Locator for filtering
   */
  getLocator(): Locator {
    return this.card;
  }
}
