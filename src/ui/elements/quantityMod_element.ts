import { Locator, Page } from '@playwright/test';

export class QuantityModElement {
    private readonly root: Locator; 
    private readonly page: Page;

    readonly quantityInput: Locator;
    readonly incrementButton: Locator;
    readonly decrementButton: Locator;

    constructor(page: Page, root: Locator) {
        this.page = page;
        this.root = root;
        this.quantityInput = root.locator('input[type="number"]').first();
        this.incrementButton = root.locator('button.increment').first();
        this.decrementButton = root.locator('button.decrement').first();
    }
}