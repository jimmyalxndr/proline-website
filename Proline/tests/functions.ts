/**
 * Helper functions for use in our Playwright tests.
 */

import type { Page, TestInfo } from '@playwright/test';
import { expect, test } from '@playwright/test';

export async function checkPageLoadTime(page: Page, TestInfo: TestInfo) {
    const maxPageLoadTime = 2000;

    // Use Performance API to measure performance
    // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType
    const [performanceTiming] = await page.evaluate(() => {
        const [timing] = performance.getEntriesByType('navigation');
        return [timing];
    });

    // Calculate the time taken from navigation start to load event end.
    const timeTaken = performanceTiming.duration - performanceTiming.startTime;

    // Add the performance annotation to the HTML report.
    test.info().annotations.push({
        type: 'Performance',
        description: `"${TestInfo.project.name}" - ${TestInfo.title} took ${timeTaken.toFixed(0)}ms to load`,
    });

    // Check if the page load time is acceptable.
    expect(timeTaken).toBeLessThan(maxPageLoadTime);

    // Log if the page load time is getting close of the limit.
    if (timeTaken >= maxPageLoadTime * 0.75) {
        // Console.
        console.warn(
            `Heads up: "${TestInfo.project.name}" - ${TestInfo.title} took ${timeTaken.toFixed(0)}ms to load. That's slow!`
        );

        // HTML report.
        test.info().annotations.push({
            type: 'Warning',
            description: `"${TestInfo.project.name}" - ${TestInfo.title} took ${timeTaken.toFixed(0)}ms to load. That's slow!`,
        });
    }
}
