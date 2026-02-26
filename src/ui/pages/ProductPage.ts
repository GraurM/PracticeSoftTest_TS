import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly totalPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.getByRole('heading', { level: 1 });
    this.productPrice = page.locator('group').first().locator('generic:has-text("$")').first();
    this.quantityInput = page.getByRole('textbox').first();
    this.totalPrice = page.locator('generic:has-text("Total Price")');
    this.addToCartButton = page.getByRole('link', { name: /Add to Cart/ });
  }

  async navigateToProduct(productId: number): Promise<void> {
    await this.goto(`/index.php?rt=product/product&product_id=${productId}`);
    await this.isPageLoaded();
  }

  async getProductTitle(): Promise<string | null> {
    return await this.productTitle.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async getTotalPrice(): Promise<string | null> {
    return await this.totalPrice.textContent();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    // Wait for navigation to cart page
    await this.page.waitForLoadState('networkidle').catch(() => {
      console.warn('Cart page may still be loading...');
    });
  }

  getPage(): Page {
    return this.page;
  }
}
