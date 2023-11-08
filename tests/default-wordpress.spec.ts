// We defined this import path in the tsconfig.json.
import { test, expect } from '@test-utils';

test('No admin bar appears on the front end when the plugin is inactive', async ({
    page,
    requestUtils,
}) => {
    // We always start by setting the application in the desired state.
    // Here, the only requirement is to have the plugin deactivated.
    await requestUtils.activatePlugin('wp-guest-bar');

    await page.goto('/');

    // Playwright's documentation argues against relying too much on CSS locators.
    // But there are times when that's fine, or there's no other way.
    // https://playwright.dev/docs/locators#locate-by-css-or-xpath
    const adminBar = page.locator('#wpadminbar');

    // By default, visitors shouldn't see an admin bar.
    // But, as we're testing a plugin that adds one for visitors,
    // it's a good first step confirming the expected behavior of WordPress.
    await expect(adminBar).not.toBeVisible();
});
