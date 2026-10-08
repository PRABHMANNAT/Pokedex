import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/PokeAPI/sprites/**', (route) =>
    route.fulfill({ path: 'public/brand/pikachu.png', contentType: 'image/png' }),
  );
  await page.goto('/');
});

test('refresh changes the feature and keeps its name, artwork and encounter link aligned', async ({
  page,
}) => {
  const hero = page.locator('.hero-art');
  const original = await hero.getAttribute('data-pokemon-id');
  await page.reload();
  await expect(hero).not.toHaveAttribute('data-pokemon-id', original);
  const id = await hero.getAttribute('data-pokemon-id');
  const name = await hero.locator('.hero-art-bottom strong').textContent();
  await expect(hero).toHaveAttribute('aria-label', `Meet ${name}`);
  await expect(hero).toHaveAttribute('href', `/?pokemon=${id}`);
  await expect(hero.locator('.hero-pokemon')).toHaveAttribute('src', new RegExp(`/${id}\\.png$`));
  await page.getByRole('searchbox').fill('pikachu');
  await expect(hero).toHaveAttribute('data-pokemon-id', id);
  await hero.click();
  await expect(page.getByRole('dialog').getByRole('heading', { name, exact: true })).toBeVisible();
});

test('artwork is centered, contained, and separate from the visible vertical name', async ({
  page,
}) => {
  for (const width of [1440, 920, 700, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    const card = await page.locator('.hero-art').boundingBox();
    const art = await page.locator('.hero-pokemon').boundingBox();
    const rail = await page.locator('.hero-japanese').boundingBox();
    expect(Math.abs(art.x + art.width / 2 - (card.x + card.width / 2))).toBeLessThan(2);
    expect(art.y).toBeGreaterThan(card.y);
    expect(art.y + art.height).toBeLessThan(card.y + card.height);
    expect(art.x + art.width).toBeLessThanOrEqual(rail.x);
    await expect(page.locator('.hero-japanese')).toBeVisible();
    await expect(page.getByRole('link', { name: /My teams, 6 of 6/ })).toBeVisible();
    await expect(page.locator('.team-nav-emblem')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});
