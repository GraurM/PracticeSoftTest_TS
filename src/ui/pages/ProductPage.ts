import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { QuantityModElement } from '../elements/quantityMod_element';

/**
 * ProductPage represents a single product details page.
 * Provides access to product information and add-to-cart functionality.
 * Inherits header navigation from BasePage.
 */
export class ProductPage extends BasePage {
  readonly productHeading: Locator;
  readonly productImage: Locator;
  readonly tags: Locator;
  readonly price: Locator;
  readonly co2Emissions: Locator;
  readonly description: Locator;
  readonly quantity: QuantityModElement;
  readonly addToCartButton: Locator;
  readonly addToFavouritesButton: Locator;
  readonly relatedProducts: Locator;

  constructor(page: Page) {
    super(page);
    this.productHeading = page.getByRole('heading', { level: 1 });
    this.productImage = page.locator('.product-image');
    this.tags = page.locator('.product-tags .tag');
    this.price = page.locator('.product-price');
    this.co2Emissions = page.locator('.product-co2-emissions');
    this.description = page.locator('.product-description');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.quantity = new QuantityModElement(page, page.locator('.quantity-mod-element'));
    this.addToFavouritesButton = page.getByRole('button', { name: /add to favourites/i });
    this.relatedProducts = page.locator('.related-products');
  }

  /**
   * Add the product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Add the product to favourites
   */
  async addToFavourites(): Promise<void> {
    await this.addToFavouritesButton.click();
  }
}
