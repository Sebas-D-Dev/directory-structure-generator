import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('guest can inspect, preview/cancel, change options, undo, and export', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/examples/go/');
  await expect(page.getByRole('heading', {level: 1})).toHaveText(/The reasons behind a Go layout/);
  await expect(page.locator('#inspector-heading')).toBeVisible();
  await page.getByRole('button', {name: 'go.mod', exact: false}).click();
  await expect(page.locator('#inspector-heading')).toHaveText('go.mod');
  await page.getByRole('button', {name: 'Read selected explanation'}).click();
  await expect(page.locator('#inspector-heading')).toBeFocused();
  await page.getByRole('button', {name: 'Preview this option'}).click();
  await expect(page.getByRole('heading', {name: 'Preview: Separate the reusable behavior'})).toBeVisible();
  await page.getByRole('button', {name: 'Cancel preview'}).click();
  await expect(page.locator('.change-preview')).toHaveCount(0);
  await expect(page.getByRole('button', {name: 'Preview this option'})).toBeFocused();
  await page.getByRole('button', {name: 'Preview this option'}).click();
  await page.getByRole('button', {name: 'Use this option'}).click();
  await expect(page.locator('.workspace-toolbar')).toContainText('Separate the reusable behavior');
  await expect(page.locator('.workspace-toolbar h3')).toBeFocused();
  await page.getByRole('button', {name: 'Use linear outline'}).click();
  await page.getByRole('button', {name: 'photo-renamer/internal', exact: false}).first().click();
  await expect(page.locator('#inspector')).toContainText('Go’s internal-import restriction');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export tree + rationale'}).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const text = await readFile(path!, 'utf8');
  expect(text).toContain('Sources:');
  expect(text).toContain('planned and unrun');
  await page.getByRole('button', {name: 'Undo last option change'}).click();
  await expect(page.locator('.workspace-toolbar')).toContainText('Keep the command together');
  await expect(page.locator('.workspace-toolbar h3')).toBeFocused();
  await expect(page.locator('#inspector-heading')).toHaveText('main.go');
  expect(errors).toEqual([]);
});

test('unsupported combinations stay honest and reload has no false saved state', async ({page}) => {
  await page.goto('/examples/go/');
  await page.getByRole('checkbox', {name: 'Library', exact: false}).check();
  await expect(page.getByText('This combination doesn’t have an authored lesson yet.')).toBeVisible();
  await expect(page.getByText('Memory-only foundation:', {exact: false})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('checkbox', {name: 'Library', exact: false})).not.toBeChecked();
  await expect(page.getByRole('checkbox', {name: 'Command-line tool', exact: false})).toBeChecked();
});

test('keyboard and small-screen content are reachable without overflow', async ({page}) => {
  await page.goto('/examples/go/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', {name: 'Use linear outline'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', {name: 'Use nested outline'})).toBeVisible();
  await page.getByRole('button', {name: 'photo-renamer/rename.go', exact: false}).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#inspector-heading')).toHaveText('rename.go');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('static build uses local resources and enforces generated CSP', async ({page}) => {
  const remote: string[] = [];
  const consoleErrors: string[] = [];
  page.on('request', (request) => {if (!request.url().startsWith('http://127.0.0.1:4321')) remote.push(request.url());});
  page.on('console', (message) => {if (message.type() === 'error') consoleErrors.push(message.text());});
  await page.goto('/examples/go/');
  await page.getByRole('button', {name: 'Use linear outline'}).click();
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute('content', /object-src 'none'/);
  expect(remote).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('Tab visits every default node and folder disclosure responds to the keyboard', async ({page}) => {
  await page.goto('/examples/go/');
  const visited = new Set<string>();
  await page.locator('.tree-panel .node-button').first().focus();
  for (let index = 0; index < 20 && visited.size < 6; index++) {
    if (index > 0) await page.keyboard.press('Tab');
    const node = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.classList.contains('node-button') ? active.textContent : null;
    });
    if (node) visited.add(node.replace('selected', '').trim());
  }
  expect(visited.size).toBe(6);
  await page.getByRole('button', {name: 'Preview this option'}).click();
  await page.getByRole('button', {name: 'Use this option'}).click();
  const folder = page.locator('.outline-list details').first();
  const summary = folder.locator('summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(folder).not.toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(folder).toHaveAttribute('open', '');
});
