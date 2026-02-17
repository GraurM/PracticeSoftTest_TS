import { Locator, Page } from '@playwright/test';

/**
 * Header element present on all pages of the Toolshop application.
 * Encapsulates navigation, search, and account-related locators.
 */
export class Header {
  private readonly root: Locator;

  // Navigation links
  readonly headerBadge: Locator;
  readonly homeLink: Locator;
  readonly categoriesLink: Locator;
  readonly contactLink: Locator;
  readonly signInLink: Locator;
  readonly cartBadge: Locator;

  constructor(root: Locator) {
    this.root = root;

    // Navigation links - using getByRole with flexible text matching
    this.headerBadge = this.root.locator('[class*="navbar-brand"], .navbar-brand, .brand').first();
    this.homeLink = this.root.getByRole('menuitem', { name: 'Home' });
    this.categoriesLink = this.root.getByRole('menuitem', { name: 'Categories' });
    this.contactLink = this.root.getByRole('menuitem', { name: 'Contact' });
    this.signInLink = this.root.getByRole('menuitem', { name: '/Sign in' });
    this.cartBadge = this.root.getByTestId('nav-cart');
  }

  /**
   * Click on the home link to navigate to the home page
   */
  async clickHome(): Promise<void> {
    await this.homeLink.click();
  }

  /**
   * Click on the categories link/menu
   */
  async clickCategories(): Promise<void> {
    await this.categoriesLink.click();
  }

  /**
   * Click on the contact link
   */
  async clickContact(): Promise<void> {
    await this.contactLink.click();
  }

  /**
   * Click on the sign in link
   */
  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  /**
   * Get the cart item count from the badge
   */
  async getCartItemCount(): Promise<string | null> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText?.trim() ?? null;
  }

  /**
   * Check if sign in link is visible (user is logged out)
   */
  async isSignInVisible(): Promise<boolean> {
    return this.signInLink.isVisible();
  }
}
