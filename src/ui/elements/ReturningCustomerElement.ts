import { Locator, Page } from '@playwright/test';

export class ReturningCustomerElement {
    private readonly root: Locator;
    readonly pageTitle: Locator
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    constructor(root: Locator) {
        this.root = root;
        this.pageTitle = this.root.locator('h2');
        this.emailInput = this.root.locator('#loginFrm_loginname');
        this.passwordInput = this.root.locator('#loginFrm_password');
        this.loginButton = this.root.getByRole('button', { name: /Login/ });
    }
    async loginWithCredentials(loginName: string, password: string): Promise<void> {
        await this.emailInput.fill(loginName);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}