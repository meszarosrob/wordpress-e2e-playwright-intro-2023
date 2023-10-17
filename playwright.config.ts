import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // This directory holds all the test files.
    // https://playwright.dev/docs/test-configuration
    testDir: 'tests',
    // This is run before any tests. Check the file for more information.
    globalSetup: 'src/global-setup.ts',
    use: {
        // It's simpler to use relative paths when referencing our application's URLs.
        // https://playwright.dev/docs/test-webserver#adding-a-baseurl
        baseURL: process.env.WP_BASE_URL,
        // We save as much information as possible to make debugging easier.
        // https://playwright.dev/docs/api/class-testoptions#test-options-screenshot
        // https://playwright.dev/docs/api/class-testoptions#test-options-trace
        // https://playwright.dev/docs/api/class-testoptions#test-options-video
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            use: {
                // We can test on different or multiple browsers if needed.
                // https://playwright.dev/docs/test-projects#configure-projects-for-multiple-browsers
                ...devices['Desktop Firefox'],
            },
        },
    ],
    // Locally, we could take advantage of parallelism due to multicore systems.
    // However, in the CI, we typically can use only one worker at a time.
    // It's more straightforward to align how we run tests in both systems.
    // https://playwright.dev/docs/test-parallel
    workers: 1,
});
