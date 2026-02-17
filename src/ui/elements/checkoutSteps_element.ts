import { Locator } from '@playwright/test';

export class checkoutSteps {
    private readonly base: Locator;
    readonly steps: Locator;
    readonly currentStep: Locator;

    constructor(base: Locator) {
        this.base = base;
        this.steps = this.base.locator('li');
        this.currentStep = this.base.locator('.current');
    }
}