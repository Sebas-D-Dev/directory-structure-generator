import {test, expect} from '@playwright/test';

test('collection filters intersect, update counts, expose provenance and recover from empty state', async ({page}) => {
  await page.goto('/examples/');
  const gallery = page.locator('#examples');
  await expect(gallery.locator('.example-card')).toHaveCount(10);
  await gallery.getByLabel('Language / technology', {exact:true}).selectOption('Python');
  await expect(gallery.locator('.example-card')).toHaveCount(3);
  await gallery.getByLabel('Project type', {exact:true}).selectOption('Library');
  await expect(gallery.locator('.example-card')).toHaveCount(1);
  await expect(gallery.getByLabel('Language / technology', {exact:true}).getByRole('option', {name:'All · 2 examples', exact:true})).toBeAttached();
  await expect(gallery.getByRole('status')).toContainText('1 of 10');
  await gallery.getByText('Consequences and sources', {exact:true}).click();
  await expect(gallery.getByText('Package discovery still needs', {exact:false})).toBeVisible();
  await gallery.getByText('Specific-use provenance record', {exact:true}).click();
  await expect(gallery.getByText('Link and factual reference only;', {exact:false})).toBeVisible();
  await gallery.getByLabel('Language / technology', {exact:true}).selectOption('Go');
  await expect(gallery.getByRole('heading', {name:'No example matches both filters'})).toBeVisible();
  await gallery.getByRole('button', {name:'Show all examples'}).focus();
  await page.keyboard.press('Enter');
  await expect(gallery.getByLabel('Language / technology', {exact:true})).toBeFocused();
  await expect(gallery.locator('.example-card')).toHaveCount(10);
  await gallery.getByLabel('Language / technology', {exact:true}).selectOption('TypeScript');
  await gallery.getByRole('button', {name:'Clear filters'}).click();
  await expect(gallery.getByRole('button', {name:'Clear filters'})).toBeDisabled();
  await expect(gallery.getByLabel('Language / technology', {exact:true})).toBeFocused();
});

test('rename lab previews, cancels, applies, undoes and resets both semantic cases', async ({page}) => {
  await page.goto('/lab/');
  const lab = page.locator('#rename-lab');
  await lab.getByRole('button', {name:'Reveal naming consequence'}).click();
  await expect(lab.locator('.rename-delta')).toContainText('cli.go');
  await expect(lab.locator('.rename-result h3')).toBeFocused();
  await expect(lab.locator('.rename-result')).toContainText('The entry point stays the same');
  await lab.getByRole('button', {name:'Cancel rename preview'}).click();
  await expect(lab.getByRole('button', {name:'Reveal naming consequence'})).toBeFocused();
  await lab.getByRole('button', {name:'Reveal naming consequence'}).click();
  await lab.getByRole('button', {name:'Apply in model'}).click();
  await expect(lab.locator('.diagram-node').first()).toContainText('cli.go');
  await expect(lab.locator('.rename-result h3')).toBeFocused();
  await lab.getByRole('button', {name:'Undo rename'}).click();
  await expect(lab.locator('.diagram-node').first()).toContainText('main.go');
  await lab.getByRole('radio', {name:'A test file', exact:false}).check();
  await lab.getByRole('button', {name:'Reveal naming consequence'}).click();
  await expect(lab.locator('.rename-result')).toContainText('The test function is no longer discovered');
  await lab.getByRole('button', {name:'Apply in model'}).click();
  await lab.getByRole('button', {name:'Undo rename'}).click();
  await expect(lab.locator('.diagram-node').first()).toContainText('rename_test.go');
  await lab.getByLabel('Try a new filename').fill('../bad.go');
  await expect(lab.getByRole('button', {name:'Reveal naming consequence'})).toBeDisabled();
  await expect(lab.getByLabel('Try a new filename')).toHaveAttribute('aria-invalid', 'true');
  await lab.getByRole('button', {name:'Use suggested name'}).click();
  await expect(lab.getByLabel('Try a new filename')).toBeFocused();
  await page.reload();
  await expect(lab.getByRole('radio', {name:'An entry file', exact:false})).toBeChecked();
});

test('keyboard controls and reduced motion preserve the full lesson without idle animation', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/lab/');
  const lab = page.locator('#rename-lab');
  await lab.getByRole('radio', {name:'An entry file', exact:false}).focus();
  await page.keyboard.press('ArrowDown');
  await expect(lab.getByRole('radio', {name:'A test file', exact:false})).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(lab.getByLabel('Try a new filename')).toBeFocused();
  await lab.getByRole('button', {name:'Reveal naming consequence'}).focus();
  await page.keyboard.press('Enter');
  await expect(lab.locator('.rename-result')).toContainText('no longer discovered');
  expect(await lab.locator('.result-copy').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  await lab.getByText('Assumptions, sources and limits', {exact:true}).focus();
  await page.keyboard.press('Space');
  await expect(lab.getByText('No Go process is executed;', {exact:false})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length)).toBe(0);
});

test('motion is brief and user-triggered, never an ambient loop', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/lab/');
  const lab = page.locator('#rename-lab');
  await lab.getByRole('button', {name:'Reveal naming consequence'}).click();
  const timing = await lab.locator('.result-copy').evaluate((element) => {const style=getComputedStyle(element);return {duration:style.animationDuration,iterations:style.animationIterationCount};});
  expect(timing).toEqual({duration:'0.18s',iterations:'1'});
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length)).toBe(0);
});

// Static local-only captures for the independent layout review; no user data or tokens.
test('capture the original teaching collection and lab for layout review', async ({page}, testInfo) => {
  await page.goto('/examples/');
  await page.locator('#examples').screenshot({path:testInfo.outputPath('collection.png'),animations:'disabled'});
  await page.goto('/lab/');
  await page.locator('#rename-lab').getByRole('radio', {name:'A test file',exact:false}).check();
  await page.locator('#rename-lab').getByRole('button', {name:'Reveal naming consequence'}).click();
  await page.locator('#rename-lab').screenshot({path:testInfo.outputPath('rename-lab.png'),animations:'disabled'});
});

test('pointer controls work at 320px, including touch on mobile and a long valid name', async ({page, isMobile}) => {
  await page.setViewportSize({width:320,height:740});
  await page.goto('/lab/');
  const lab = page.locator('#rename-lab');
  const activate = async (name: string) => {const control=lab.getByRole('button',{name,exact:true});if(isMobile) await control.tap();else await control.click();};
  await lab.getByLabel('Try a new filename').fill('an_intentionally_long_platform_neutral_filename_for_learning.go');
  await activate('Reveal naming consequence');
  await expect(lab.locator('.rename-result')).toContainText('The entry point stays the same');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await activate('Cancel rename preview');
  await activate('Reveal naming consequence');
  await activate('Apply in model');
  await expect(lab.locator('.diagram-node').first()).toContainText('an_intentionally_long');
  await activate('Undo rename');
  await expect(lab.locator('.diagram-node').first()).toContainText('main.go');
  await lab.screenshot({path:test.info().outputPath('narrow-rename.png'),animations:'disabled'});
  await page.goto('/examples/');
  const optionWidths = await page.locator('#examples select').evaluateAll((selects) => selects.flatMap((select) => {
    const style=getComputedStyle(select);
    const canvas=document.createElement('canvas'); const context=canvas.getContext('2d')!;
    context.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const available=select.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
    return [...(select as HTMLSelectElement).options].map((option) => ({label:option.text,width:context.measureText(option.text).width,available}));
  }));
  for (const option of optionWidths) expect(option.width, option.label).toBeLessThanOrEqual(option.available);
  const tree = page.locator('#examples .mini-tree').first();
  await tree.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => tree.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await tree.evaluate((element) => getComputedStyle(element).whiteSpace)).toBe('pre');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.keyboard.press('Home');
  await page.locator('#examples').screenshot({path:test.info().outputPath('narrow-collection.png'),animations:'disabled'});
});

test('new language and technology cards remain substantive, source-backed and filterable', async ({page,isMobile},testInfo) => {
  await page.goto('/examples/');
  const gallery=page.locator('#examples');
  for (const language of ['Rust','PHP','HTML & CSS','JavaScript','Java']) {
    await gallery.getByLabel('Language / technology',{exact:true}).selectOption(language);
    await expect(gallery.locator('.example-card')).toHaveCount(1);
    await expect(gallery.getByRole('status')).toContainText('1 of 10');
    const card=gallery.locator('.example-card');
    await expect(card.locator('.mini-tree')).toBeVisible();
    await expect(card.locator('.naming-note')).not.toBeEmpty();
    const disclosure=card.getByText('Consequences and sources',{exact:true});
    if(isMobile) await disclosure.tap(); else await disclosure.click();
    await expect(card.getByRole('heading',{name:'If this changes'})).toBeVisible();
    await expect(card.locator('.card-sources a').first()).toHaveAttribute('href',/^https:\/\//);
    await card.getByText('Specific-use provenance record',{exact:true}).press('Enter');
    await expect(card.getByText('No third-party code, prose, tree, artwork or logo reproduced',{exact:false})).toBeVisible();
    await card.screenshot({path:testInfo.outputPath(`card-${language.replace(/[^a-z]/gi,'').toLowerCase()}.png`),animations:'disabled'});
  }
  await page.getByRole('navigation',{name:'Footer navigation'}).getByRole('link',{name:'Naming Lab',exact:true}).click();
  await expect(page.getByRole('heading',{level:1,name:'Naming Lab'})).toBeVisible();
  await expect(page.getByText('Available now: two Go filename experiments',{exact:false})).toBeVisible();
  await expect(page.getByText('Those experiments are not available yet',{exact:false})).toBeVisible();
});
