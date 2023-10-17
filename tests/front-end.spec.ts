import { test, expect } from '@test-utils';

// We have multiple tests in this file, all requiring the plugin to be activated.
// Compare this to default-wordpress.spec.ts.
// https://playwright.dev/docs/api/class-test#test-before-all
// https://playwright.dev/docs/api/class-test#test-before-each
test.beforeAll(async ({ requestUtils }) => {
    await requestUtils.activatePlugin('wp-guest-bar');
});

test.describe('Visitor', () => {
    // Compare this to the next test group (describe), where this is uncommented.
    // test.use({ storageState: process.env.WP_AUTH_STORAGE });

    test('An admin bar with a login link is displayed', async ({ page }) => {
        await page.goto('/');

        const adminBar = page.locator('#wpadminbar');
        // Multiple login links can exist on the page; we are interested in the one in the admin bar.
        const loginLink = adminBar.getByRole('link', { name: 'Log In' });
        const loginLinkUrl = await loginLink.getAttribute('href');

        await expect(adminBar).toBeVisible();
        await expect(loginLink).toBeVisible();
        await expect(loginLinkUrl).toContain('/wp-login.php');
    });

    test('When set, a custom message is displayed in the admin bar', async ({
        page,
        wpGuestBar,
    }) => {
        // It's irrelevant how the custom message is set since it's part of the precondition.
        // We are using our custom util defined in /src/test-utils/wp-guest-bar/index.ts.
        await wpGuestBar.setCustomMessage('Sic vita est!');

        await page.goto('/');

        const customMessageItem = page.getByText('Sic vita est!');

        await expect(customMessageItem).toBeVisible();
    });

    test('When none set, no custom message is displayed in the admin bar', async ({
        page,
        wpGuestBar,
    }) => {
        await wpGuestBar.deleteCustomMessage();

        await page.goto('/');

        const customMessageItem = page.locator('#wp-admin-bar-wpgb-message');

        await expect(customMessageItem).not.toBeVisible();
    });

    test('The custom message in the admin bar supports HTML and styling', async ({
        page,
        wpGuestBar,
    }) => {
        await wpGuestBar.setCustomMessage(
            '<span style="color: rgb(255, 0, 0)"><em>Sic</em> vita est!</span>',
        );

        await page.goto('/');

        const customMessageItem = page.getByText('Sic vita est!');
        const emphasis = customMessageItem.getByRole('emphasis');

        await expect(emphasis).toBeVisible();
        await expect(customMessageItem).toHaveCSS('color', 'rgb(255, 0, 0)');
    });
});

test.describe('Logged in', () => {
    // Because we want to act as a logged-in user, we make previously saved authenticated state available to the context.
    // We obtained that during the global setup step; see /src/global-setup.ts.
    test.use({ storageState: process.env.WP_AUTH_STORAGE });

    test('The default admin bar is displayed', async ({ page }) => {
        await page.goto('/');

        const adminBar = page.locator('#wpadminbar');
        // The howdy greeting is displayed for logged-in users.
        const profileLink = adminBar.getByRole('link', { name: 'Howdy' });
        const profileLinkUrl = await profileLink.getAttribute('href');

        await expect(adminBar).toBeVisible();
        await expect(profileLink).toBeVisible();
        await expect(profileLinkUrl).toContain('/wp-admin/profile.php');
    });
});
