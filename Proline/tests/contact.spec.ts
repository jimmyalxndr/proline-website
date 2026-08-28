import { test, expect } from '@playwright/test';
import { checkPageLoadTime } from './functions';

const CONTACT_URL = '/contact/';

// Check <title> of the page.
test('title is correct', async ({ page }) => {
    await page.goto(CONTACT_URL);

    await expect(page).toHaveTitle('Contact Us | Proline Metal Cladding');
});

// Is the right menu item active?
test('contact menu item', async ({ page }) => {
    await page.goto(CONTACT_URL);

    const currentMenuItem = page.locator(`nav a[href="${CONTACT_URL}"]`);
    await expect(currentMenuItem).toHaveClass(/font-bold/);
});

// Is the page loading in a reasonable time?
test('page load time', async ({ page }, testInfo) => {
    await page.goto(CONTACT_URL);

    await checkPageLoadTime(page, testInfo);
});
