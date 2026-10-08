import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/PokeAPI/sprites/**', route => route.fulfill({ path: 'public/brand/pikachu.png', contentType: 'image/png' }));
  await page.goto('/teams');
});

test('default PDF team, custom editing, lead order, persistence and deletion', async ({ page }) => {
  await expect(page.locator('.team-slots .team-slot')).toHaveCount(6);
  await expect(page.locator('.team-slot').first()).toContainText('Mega Charizard X');
  await page.getByRole('button', { name: 'Create team', exact: true }).click();
  await page.getByLabel('A name for your next adventure').fill('Pocket squad');
  await page.getByRole('button', { name: 'Save new team' }).click();
  await expect(page.locator('.empty-team-slot')).toHaveCount(6);
  await page.getByRole('button', { name: 'Choose Pokémon for slot 1' }).click();
  await expect(page.getByLabel('Search Pokémon for your team')).toBeFocused();
  await page.getByLabel('Search Pokémon for your team').fill('bulbasaur');
  await page.getByRole('button', { name: 'Add Bulbasaur to team', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Add Bulbasaur to team' })).toBeDisabled();
  await page.getByLabel('Search Pokémon for your team').fill('charmander');
  await page.getByRole('button', { name: 'Add Charmander to team', exact: true }).click();
  await page.getByRole('button', { name: 'Move Charmander earlier' }).click();
  await expect(page.locator('.team-slot').first()).toContainText('Charmander');
  await page.getByLabel('Team name', { exact: true }).fill('Route one');
  await page.getByRole('button', { name: 'Rename', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Route one.' })).toBeVisible();
  await expect(page.locator('.team-slot').first()).toContainText('Charmander');
  await page.getByRole('button', { name: 'Remove Bulbasaur from team' }).click();
  await expect(page.locator('.empty-team-slot')).toHaveCount(5);
  await page.getByRole('button', { name: 'Delete current team' }).click();
  await page.getByRole('button', { name: 'Yes, delete' }).click();
  await expect(page.locator('.team-slot').first()).toContainText('Mega Charizard X');
});

test('shared teams import only on confirmation and invalid links cannot replace saves', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy team link' }).click();
  await expect(page.getByRole('button', { name: 'Link copied' })).toBeVisible();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain('lineup=kanto-');
  await page.goto('/teams?lineup=25.7&name=Shared%20duo');
  await expect(page.getByRole('heading', { name: 'Prabh’s Kanto six.' })).toBeVisible();
  await page.getByRole('button', { name: 'Save shared team' }).click();
  await expect(page.getByRole('heading', { name: 'Shared duo.' })).toBeVisible();
  await expect(page.locator('.empty-team-slot')).toHaveCount(4);
  await page.goto('/teams?lineup=6.kanto-10034');
  await expect(page.getByText('This team link contains an invalid or duplicate Pokémon.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shared duo.' })).toBeVisible();
});

test('all regional picks, special forms, shiny choices and editable presets', async ({ page }) => {
  await page.goto('/picks');
  await expect(page.locator('.region-tabs button')).toHaveCount(10);
  await expect(page.locator('.developer-pick-card')).toHaveCount(23);
  await expect(page.locator('.developer-pick-card').filter({ hasText: 'Mega Charizard X' }).locator('img')).toHaveAttribute('src', /10034.png/);
  await expect(page.locator('.developer-pick-card').filter({ hasText: 'Shiny Gyarados' }).first().locator('img')).toHaveAttribute('src', /shiny\/130.png/);
  await page.getByRole('button', { name: 'Gigantamax', exact: true }).click();
  await expect(page.locator('.developer-pick-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'Use this team' }).click();
  await expect(page.getByRole('heading', { name: 'Prabh’s Gigantamax six.' })).toBeVisible();
  await expect(page.locator('.team-slot').first()).toContainText('Gigantamax Snorlax');
  await page.getByRole('button', { name: 'Remove Gigantamax Snorlax from team' }).click();
  await expect(page.locator('.empty-team-slot')).toHaveCount(1);
});

test('team picker filters and small screens fit without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel('Team picker type').selectOption('fire');
  await page.getByLabel('Team picker generation').selectOption('1');
  await expect(page.locator('.picker-card')).toHaveCount(12);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/picks?region=alola');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('switch', { name: 'Night mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('blocked storage stays usable and corrupted saves fall back safely', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('pokedex:teams:v1', '{bad json'));
  await page.reload();
  await expect(page.locator('.team-slot').first()).toContainText('Mega Charizard X');
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('Storage blocked'); }; });
  await page.reload();
  await expect(page.getByText('Storage unavailable · Your team works for this session')).toBeVisible();
  await page.getByRole('button', { name: 'Remove Mega Charizard X from team' }).click();
  await expect(page.locator('.empty-team-slot')).toHaveCount(1);
});
