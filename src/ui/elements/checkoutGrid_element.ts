import { Locator } from '@playwright/test';

export class checkoutGrid {
    private readonly base: Locator;
    readonly headers: Locator;
    readonly rows: Locator;
    readonly footer: Locator;

    constructor(base: Locator) {
        this.base = base;
        this.headers = this.base.locator('thead tr th');
        this.rows = this.base.locator('tbody tr');
        this.footer = this.base.locator('tfoot tr');
    }
}