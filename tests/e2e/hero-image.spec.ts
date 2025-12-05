import { test, expect } from '@playwright/test';

test('Hero image should be visible and loaded', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for the page to be ready
    await page.waitForLoadState('networkidle');

    // Locate the image using the alt text
    const heroImage = page.getByAltText('Professional resume builder preview');

    // Check if the image element is attached and visible
    await expect(heroImage).toBeVisible();

    // Debugging: Check the source url
    const src = await heroImage.getAttribute('src');
    console.log('Image source attribute:', src);

    if (src) {
        // Try to fetch the image directly to check status code
        try {
            const response = await page.request.get(src);
            console.log(`Image fetch status for ${src}:`, response.status());
            const body = await response.body();
            console.log(`Image content length: ${body.length}`);
        } catch (e) {
            console.log('Failed to fetch image directly:', e);
        }
    }

    // Debugging: Check naturalWidth and complete status
    const imageState = await heroImage.evaluate((img: HTMLImageElement) => ({
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        currentSrc: img.currentSrc
    }));
    console.log('Image Element State:', imageState);

    // Take a screenshot BEFORE failing assertion so we can see what's happening
    await page.screenshot({ path: 'test-results/hero-image-debug.png', fullPage: false });

    // strict check: ensure the image actually loaded by checking naturalWidth
    expect(imageState.naturalWidth > 0, 'Image naturalWidth should be > 0').toBeTruthy();
});
