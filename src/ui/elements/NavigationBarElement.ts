import { Locator } from '@playwright/test';

export class NavigationBarElement {
    private readonly root: Locator;
    readonly categoryLinks: Locator;

    constructor(root: Locator) {
        this.root = root;
        this.categoryLinks = this.root.getByRole('link', { name: /Apparel|Makeup|Skincare|Fragrance|Men|Hair Care|Books/ });
    }

    async navigateToCategory(categoryName: string): Promise<void> {
        const categoryPath = categoryName.toLowerCase().split("->");
        let categoryLink = this.categoryLinks;

        for (const category of categoryPath) {
            categoryLink = categoryLink.getByRole('link', { name: category.trim(), exact: false });
            await categoryLink.click();
        }
      }
    }

