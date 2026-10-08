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
const visibleArtworkReady = async () => {
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter(
        (img) =>
          img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0,
      )
      .every((img) => img.complete && img.naturalWidth > 0),
  );
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images)
        .filter(
          (img) =>
            img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0,
        )
        .map((img) => img.decode().catch(() => {})),
    );
    await new Promise(requestAnimationFrame);
  });
};
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(process.env.CAPTURE_URL || 'http://127.0.0.1:5173/');
await page.locator('.pokemon-card').first().waitFor();
await page.evaluate(() => document.fonts.ready);
await visibleArtworkReady();
await page.screenshot({
  path: fileURLToPath(new URL('../docs/images/desktop.png', import.meta.url)),
});
await page.getByRole('switch', { name: 'Night mode' }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
await page.waitForTimeout(350); // Let theme color transitions settle before the still capture.
await page.screenshot({ path: fileURLToPath(new URL('../docs/images/dark.png', import.meta.url)) });
await page.getByRole('switch', { name: 'Night mode' }).click();
await page.waitForTimeout(350);
await page.locator('.hero-art').click();
await page.getByRole('dialog').waitFor();
await page.locator('.panel-art img').waitFor();
await page.waitForFunction(
  () => !document.querySelector('.flavor-text')?.textContent.includes('Fetching'),
);
await visibleArtworkReady();
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
await page.setViewportSize({ width: 1440, height: 1160 });
const captureRoot = process.env.CAPTURE_URL || 'http://127.0.0.1:5173/';
for (const [route, filename] of [
  ['teams', 'teams.png'],
  ['picks', 'developer-picks.png'],
  ['teams/all', 'team-collection.png'],
  ['teams/all?creator=prabh&gen=1', 'team-focus.png'],
]) {
  await page.goto(new URL(route, captureRoot).href);
  await page
    .locator(
      route === 'teams'
        ? '.team-workbench'
        : route === 'picks'
          ? '.developer-picks-grid'
          : '.team-gallery-grid',
    )
    .first()
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await visibleArtworkReady();
  await page.screenshot({
    path: fileURLToPath(new URL(`../docs/images/${filename}`, import.meta.url)),
    animations: 'disabled', // Finish finite entrance animations for a settled documentation capture.
  });
}
await page.goto(new URL('teams', captureRoot).href);
await page.setViewportSize({ width: 390, height: 844 });
await page.locator('.team-workbench').scrollIntoViewIfNeeded();
await visibleArtworkReady();
await page.screenshot({
  path: fileURLToPath(new URL('../docs/images/mobile-team.png', import.meta.url)),
});
await page.setViewportSize({ width: 1440, height: 450 });
await page.locator('.site-footer').scrollIntoViewIfNeeded();
await page.screenshot({
  path: fileURLToPath(new URL('../docs/images/footer.png', import.meta.url)),
});
await browser.close();
if (errors.length) throw new Error(errors.join('\n'));
console.log(
  'Captured explorer, themes, details, teams, developer picks and mobile views without runtime errors.',
);
