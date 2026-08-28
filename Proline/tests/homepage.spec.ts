import { test, expect } from '@playwright/test';
import { checkPageLoadTime } from './functions';

const HOMEPAGE_URL = '/';

// Check <title> of the page.
test('title is correct', async ({ page }) => {
    await page.goto(HOMEPAGE_URL);

    await expect(page).toHaveTitle('Proline Metal Cladding');
});

// Is the right menu item active?
test('home menu item', async ({ page }) => {
    await page.goto(HOMEPAGE_URL);

    const currentMenuItem = page.locator('nav a[href="/"]');
    await expect(currentMenuItem).toHaveClass(/font-bold/);
});

// Is the page loading in a reasonable time?
test('page load time', async ({ page }, testInfo) => {
    await page.goto(HOMEPAGE_URL);

    await checkPageLoadTime(page, testInfo);
});
