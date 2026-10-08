import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('global search, combined filters, sorting, pagination and reset', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Little creatures. Endless discovery.' }),
  ).toBeVisible();
  await expect(page.locator('.pokemon-card')).toHaveCount(24);
  await page.getByRole('button', { name: 'Discover more' }).click();
  await expect(page.locator('.pokemon-card')).toHaveCount(48);
  await page.getByRole('searchbox').fill('pecharunt');
  await expect(page.getByRole('heading', { name: 'Pecharunt', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('button', { name: 'fire', exact: true }).click();
  await page.getByLabel('GENERATION', { exact: true }).selectOption('1');
  await expect(page.locator('.pokemon-card')).toHaveCount(12);
  await page.getByLabel('Sort by').selectOption('reverse');
  await expect(page.locator('.pokemon-card').first().getByRole('heading')).toHaveText('Moltres');
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('.pokemon-card')).toHaveCount(24);
});

test('collection persists, theme toggles, and shiny artwork switches', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Bulbasaur to collection' }).click();
  await page.getByRole('button', { name: /My collection/ }).click();
  await expect(page.locator('.pokemon-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.pokemon-card')).toHaveCount(1);
  await page.getByRole('switch', { name: 'Night mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Shiny mode' }).click();
  await expect(page.locator('.card-art img')).toHaveAttribute('src', /shiny\/1.png/);
  await page.getByRole('button', { name: 'Remove Bulbasaur from collection' }).click();
  await expect(page.getByRole('heading', { name: 'Your next favorite is waiting.' })).toBeVisible();
});

test('dialog opens, navigates evolution, closes with Escape and restores focus', async ({
  page,
}) => {
  const card = page.getByRole('button', { name: 'View Bulbasaur details' });
  await card.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Bulbasaur', exact: true })).toBeVisible();
  await expect(dialog.getByRole('meter')).toHaveCount(6);
  await dialog.getByRole('button', { name: /Ivysaur/ }).click();
  await expect(dialog.getByRole('heading', { name: 'Ivysaur', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(card).toBeFocused();
});

test('detail routes and unavailable network keep core data usable', async ({ page }) => {
  await page.route('https://pokeapi.co/**', (route) => route.abort());
  await page.goto('/pokemon/6');
  await expect(page.getByRole('heading', { name: 'Charizard', exact: true })).toBeVisible();
  await expect(
    page.getByText('Field notes are unavailable right now.', { exact: false }),
  ).toBeVisible();
  await expect(page.getByText('×4', { exact: true })).toBeVisible();
  await page.goto('/pokemon/9999');
  await expect(page.getByRole('heading', { name: 'This Pokémon wandered off.' })).toBeVisible();
});

test('mobile layout fits and has usable filters and modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  await page.getByRole('button', { name: 'water', exact: true }).click();
  await page.getByRole('button', { name: 'View Squirtle details' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close Pokémon details' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
