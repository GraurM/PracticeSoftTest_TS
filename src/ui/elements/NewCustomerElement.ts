import { Locator } from '@playwright/test';

export class NewCustomerElement {
    private readonly root: Locator;
    readonly pageTitle: Locator;
    readonly registerAccountRadio: Locator;
    readonly guestCheckoutRadio: Locator;
    readonly continueButton: Locator;   
    constructor(root: Locator) {
        this.root = root;
        this.registerAccountRadio = this.root.locator('#accountFrm_accountregister');
        this.guestCheckoutRadio = this.root.locator('#accountFrm_accountguest');
        this.continueButton = this.root.locator('button:has-text("Continue")');
        this.pageTitle = this.root.locator('h2');
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
}