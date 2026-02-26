import { NewCustomerElement } from "../elements/NewCustomerElement";
import { ReturningCustomerElement } from "../elements/ReturningCustomerElement";
import { BasePage } from "./BasePage";
import { Page, Locator } from "@playwright/test";

export class AccountLoginPage extends BasePage {
    readonly newCustomerFrame: NewCustomerElement;
    readonly returningCustomerFrame: ReturningCustomerElement;
    private readonly headerTitle: Locator;

    constructor(page: Page) {
        super(page);    
        this.newCustomerFrame = new NewCustomerElement(page.locator('div.newcustomer'));
        this.returningCustomerFrame = new ReturningCustomerElement(page.locator('div.returncustomer'));
        this.headerTitle = page.locator('h1.heading1');
    }   
    async navigate(): Promise<void> {
        await this.goto('/index.php?rt=account/login');
        await this.isPageLoaded();
    }
    async loginWithCredentials(loginName: string, password: string): Promise<void> {
        await this.returningCustomerFrame.loginWithCredentials(loginName, password);
    }
    getPage(): Page {
        return this.page;
    }

    getPageTitle(): Locator {
        return this.headerTitle;
    }

}