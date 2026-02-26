import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly registerAccountRadio: Locator;
  private readonly guestCheckoutRadio: Locator;
  private readonly continueButton: Locator;
  private readonly loginInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.registerAccountRadio = page.getByRole('radio', { name: 'Register Account' });
    this.guestCheckoutRadio = page.getByRole('radio', { name: 'Guest Checkout' });
    this.continueButton = page.getByRole('button', { name: /Continue/ }).first();
    this.loginInput = page.getByRole('textbox').first();
    this.passwordInput = page.getByRole('textbox').nth(1);
    this.loginButton = page.getByRole('button', { name: /Login/ });
  }

  async navigate(): Promise<void> {
    await this.goto('/index.php?rt=account/login');
    await this.isPageLoaded();
  }

  async selectGuestCheckout(): Promise<void> {
    await this.guestCheckoutRadio.check();
  }

  async selectRegisterAccount(): Promise<void> {
    await this.registerAccountRadio.check();
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async loginWithCredentials(loginName: string, password: string): Promise<void> {
    await this.loginInput.fill(loginName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  getPage(): Page {
    return this.page;
  }
}
