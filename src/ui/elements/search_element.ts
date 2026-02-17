import { Locator, Page } from '@playwright/test';

/**
 * Search element component for the HomePage.
 * Contains search input, clear button, and search button with related methods.
 */
export class SearchElement {
  private readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: /search/i });
    this.searchButton = page.getByRole('button', { name: /^search$/i });
    this.clearButton = page.locator('button[data-test="search-clear"]').or(
      page.getByRole('button', { name: /clear|reset|×/i })
    );
  }

  /**
   * Fill the search input with a term
   */
  async fillSearch(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  /**
   * Click the search button to submit the search
   */
  async submit(): Promise<void> {
    await this.searchButton.click();
  }

  /**
   * Search for a term and submit
   */
  async search(term: string): Promise<void> {
    await this.fillSearch(term);
    await this.submit();
  }

  /**
   * Clear the search input
   */
  async clear(): Promise<void> {
    if (await this.clearButton.isVisible()) {
      await this.clearButton.click();
    } else {
      await this.searchInput.clear();
    }
  }

  /**
   * Get the current value of the search input
   */
  async getValue(): Promise<string> {
    return this.searchInput.inputValue();
  }

  /**
   * Check if search input is visible
   */
  async isVisible(): Promise<boolean> {
    return this.searchInput.isVisible();
  }
}
