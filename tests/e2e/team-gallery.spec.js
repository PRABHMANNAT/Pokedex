import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/PokeAPI/sprites/**', (route) =>
    route.fulfill({ path: 'public/brand/pikachu.png', contentType: 'image/png' }),
  );
  await page.goto('/teams');
});

test('all presets appear in the selector and switching preserves edited copies', async ({
  page,
}) => {
  await expect(
    page.locator('#active-team optgroup[label="Prabh’s generation teams"] option'),
  ).toHaveCount(10);
  await page.getByLabel('CHOOSE A TEAM').selectOption('preset:hoenn');
  await expect(page.getByRole('heading', { name: 'Prabh’s Hoenn six.' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Mega Blaziken from team' }).click();
  await page.getByLabel('CHOOSE A TEAM').selectOption('preset:kanto');
  await expect(page.getByRole('heading', { name: 'Prabh’s Kanto six.' })).toBeVisible();
  await page.getByLabel('CHOOSE A TEAM').selectOption('preset:hoenn');
  await expect(page.locator('.empty-team-slot')).toHaveCount(1);
  await expect(page.locator('#active-team optgroup[label="Your saved teams"] option')).toHaveCount(
    2,
  );
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Prabh’s Hoenn six.' })).toBeVisible();
  await expect(page.locator('.empty-team-slot')).toHaveCount(1);
});

test('collection exposes every generation, filters by source, and opens local copies', async ({
  page,
}) => {
  await page.getByRole('link', { name: 'View all generation teams' }).click();
  await expect(page.locator('.team-gallery-card')).toHaveCount(11);
  await page.getByLabel('Created by').selectOption('prabh');
  await expect(page.locator('.team-gallery-card')).toHaveCount(10);
  await page.getByLabel('Generation', { exact: true }).selectOption('9');
  await expect(page.locator('.team-gallery-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Prabh’s Paldea six' })).toBeVisible();
  await page.getByRole('button', { name: 'Open Prabh’s Paldea team' }).click();
  await expect(page.getByRole('heading', { name: 'Prabh’s Paldea six.' })).toBeVisible();
  await page.getByRole('link', { name: 'View all generation teams' }).click();
  await page.getByLabel('Created by').selectOption('saved');
  await expect(page.locator('.saved-gallery-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Edit Prabh’s Kanto six', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Prabh’s Kanto six.' })).toBeVisible();
});

test('custom teams appear in their own collection and empty filters can reset', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Create team', exact: true }).click();
  await page.getByLabel('A name for your next adventure').fill('My forest team');
  await page.getByRole('button', { name: 'Save new team' }).click();
  await page.getByLabel('Search Pokémon for your team').fill('bulbasaur');
  await page.getByRole('button', { name: 'Add Bulbasaur to team' }).click();
  await page.goto('/teams/all?creator=saved&gen=1');
  await expect(page.getByRole('heading', { name: 'My forest team' })).toBeVisible();
  await page.getByLabel('Generation', { exact: true }).selectOption('9');
  await expect(page.getByRole('heading', { name: 'No teams in this view yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all teams' }).click();
  await expect(page.locator('.team-gallery-card')).toHaveCount(12);
});

test('notebook, collection, centered credit and source button fit desktop and mobile', async ({
  page,
}) => {
  await expect(page.getByText('SIX COMPANIONS. A THOUSAND POSSIBILITIES.')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore Prabh’s developer picks' })).toBeVisible();
  for (const width of [1440, 920, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    const footer = await page.locator('.site-footer').boundingBox();
    const credit = await page.locator('.maker-credit').boundingBox();
    expect(Math.abs(credit.x + credit.width / 2 - footer.x - footer.width / 2)).toBeLessThan(2);
    await expect(page.getByRole('link', { name: 'View source on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/PRABHMANNAT/Pokedex',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.goto('/teams/all');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('switch', { name: 'Night mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
