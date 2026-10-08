import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

// These are real browser captures, using original sourced artwork.
await mkdir(new URL('../docs/images/', import.meta.url), { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1160 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(process.env.CAPTURE_URL || 'http://127.0.0.1:5173/');
await page.locator('.pokemon-card').first().waitFor();
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() =>
  Array.from(document.images)
    .filter((img) => img.getBoundingClientRect().top < innerHeight)
    .every((img) => img.complete),
);
await page.screenshot({
  path: fileURLToPath(new URL('../docs/images/desktop.png', import.meta.url)),
});
await page.getByRole('switch', { name: 'Night mode' }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
await page.waitForTimeout(350); // Let theme color transitions settle before the still capture.
await page.screenshot({ path: fileURLToPath(new URL('../docs/images/dark.png', import.meta.url)) });
await page.getByRole('switch', { name: 'Night mode' }).click();
await page.waitForTimeout(350);
await page.getByRole('link', { name: 'Meet Charizard' }).click();
await page.getByRole('dialog').waitFor();
await page.locator('.panel-art img').waitFor();
await page.waitForFunction(
  () => !document.querySelector('.flavor-text')?.textContent.includes('Fetching'),
);
await page.screenshot({
  path: fileURLToPath(new URL('../docs/images/details.png', import.meta.url)),
});
await page.keyboard.press('Escape');
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => {
  document.activeElement?.blur();
  window.scrollTo(0, 0);
});
await page.screenshot({
  path: fileURLToPath(new URL('../docs/images/mobile.png', import.meta.url)),
  fullPage: false,
});
await browser.close();
if (errors.length) throw new Error(errors.join('\n'));
console.log(
  'Captured desktop, dark theme, detail dialog and mobile screenshots without runtime errors.',
);
