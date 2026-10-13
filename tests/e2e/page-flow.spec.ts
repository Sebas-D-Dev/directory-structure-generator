import {test, expect} from '@playwright/test';

test('page journey separates build from delivery and compares hydration without losing context', async ({page}) => {
  await page.goto('/');
  const flow = page.locator('#astro-flow');
  await expect(flow.getByRole('radio', {name:'Static markup',exact:false})).toBeChecked();
  await expect(flow.locator('#flow-step-heading')).toHaveText('A source path becomes a route');
  await expect(flow.getByRole('button', {name:'Previous step',exact:true})).toBeDisabled();
  await flow.getByRole('button', {name:'Next step',exact:true}).click();
  await expect(flow.locator('#flow-step-heading')).toBeFocused();
  await expect(flow.locator('#flow-step-heading')).toHaveText('Render the page and its imports');
  await flow.getByRole('radio', {name:'Interactive island',exact:false}).check();
  await expect(flow.locator('#flow-step-heading')).toHaveText('Render HTML before adding interaction');
  await expect(flow.locator('#flow-file-heading')).toHaveText('src/layouts/SiteFrame.astro');
  await flow.getByRole('button', {name:'Next step',exact:true}).click();
  await expect(flow.locator('#flow-step-heading')).toHaveText('Include the picker’s browser code');
  await flow.getByRole('button', {name:'Next step',exact:true}).click();
  await expect(flow.locator('#flow-explanation')).toContainText('It does not run index.astro');
  await flow.getByRole('button', {name:'Next step',exact:true}).click();
  await expect(flow.locator('#flow-step-heading')).toHaveText('Hydrate this island on page load');
  await expect(flow.getByRole('button', {name:'Next step',exact:true})).toBeDisabled();
  await expect(flow.locator('#flow-step-heading')).toBeFocused();
  await flow.getByRole('radio', {name:'Static markup',exact:false}).check();
  await expect(flow.locator('#flow-step-heading')).toHaveText('Read the HTML as delivered');
  await expect(flow.locator('#flow-explanation')).toContainText('separately authored scripts');
  await flow.getByRole('button', {name:'Previous step',exact:true}).click();
  await expect(flow.locator('#flow-step-heading')).toHaveText('The host serves the built page');
  await flow.getByRole('button', {name:'Back to the start',exact:true}).click();
  await expect(flow.getByRole('button', {name:/^Find the route/,exact:false})).toBeFocused();
});

test('all six file explanations connect to a sourced step and preserve original scope', async ({page}) => {
  await page.goto('/');
  const flow = page.locator('#astro-flow');
  const files = flow.getByRole('region', {name:'Files in the Astro illustration'});
  const expected = [
    ['src/pages/index.astro', 'A source path becomes a route'],
    ['src/layouts/SiteFrame.astro', 'Render the page and its imports'],
    ['src/components/TopicPicker.tsx', 'Read the HTML as delivered'],
    ['public/icon.svg', 'Publish HTML and referenced assets'],
    ['astro.config.mjs', 'A source path becomes a route'],
    ['dist/index.html', 'The host serves the built page'],
  ] as const;
  for (const [path, title] of expected) {
    await files.getByRole('button', {name:path,exact:false}).click();
    await expect(flow.locator('#flow-file-heading')).toHaveText(path!);
    await expect(flow.locator('#flow-step-heading')).toHaveText(title!);
  }
  await expect(flow.locator('#flow-file-inspector')).toContainText('Generated output');
  await files.getByRole('button', {name:'Read file explanation',exact:false}).click();
  await expect(flow.locator('#flow-file-heading')).toBeFocused();
  await flow.getByText('File sources and scope',{exact:true}).click();
  await expect(flow.locator('#flow-file-inspector').getByRole('link',{name:'Astro: on-demand rendering',exact:false})).toHaveAttribute('href', 'https://docs.astro.build/en/guides/on-demand-rendering/');
  await flow.getByText('Lesson assumptions and provenance',{exact:true}).click();
  await expect(flow).toContainText('no third-party material reproduced');
  await expect(flow).toContainText('illustrative fixture not executed');
  await expect(page.getByText('The separate Astro page journey, rename lab and example-card filters are not included.', {exact:false})).toBeVisible();
});

test('keyboard selection and reduced motion retain the full explanation', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const flow = page.locator('#astro-flow');
  await flow.getByRole('radio',{name:'Static markup',exact:false}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(flow.getByRole('radio',{name:'Interactive island',exact:false})).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(flow.getByRole('button',{name:/^Find the route/,exact:false})).toBeFocused();
  await flow.getByRole('button',{name:'Use the page',exact:true}).press('Enter');
  await expect(flow.locator('#flow-step-heading')).toHaveText('Hydrate this island on page load');
  await flow.getByText('Evidence for this step',{exact:true}).press('Space');
  await expect(flow.locator('#flow-explanation').getByRole('link',{name:'Astro: client directives',exact:false})).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().filter((item) => item.playState === 'running').length)).toBe(0);
  await page.reload();
  await expect(flow.getByRole('radio',{name:'Static markup',exact:false})).toBeChecked();
  await expect(flow.locator('#flow-step-heading')).toHaveText('A source path becomes a route');
});

test('320px touch and pointer paths keep source explanations reachable without overflow', async ({page,isMobile}, testInfo) => {
  await page.setViewportSize({width:320,height:740});
  await page.goto('/');
  const flow = page.locator('#astro-flow');
  const activate = async (locator: ReturnType<typeof flow.getByRole>) => isMobile ? locator.tap() : locator.click();
  await activate(flow.getByRole('radio',{name:'Interactive island',exact:false}));
  await activate(flow.getByRole('button',{name:'Use the page',exact:true}));
  await expect(flow.locator('#flow-step-heading')).toHaveText('Hydrate this island on page load');
  await activate(flow.getByRole('button',{name:'src/components/TopicPicker.tsx',exact:false}));
  await activate(flow.getByRole('button',{name:'Read file explanation',exact:false}));
  await expect(flow.locator('#flow-file-heading')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await flow.screenshot({path:testInfo.outputPath('astro-flow-narrow.png'),animations:'disabled'});
  await activate(flow.getByRole('button',{name:'Back to the start',exact:true}));
  await expect(flow.locator('#flow-step-heading')).toHaveText('A source path becomes a route');
  await expect(flow.getByRole('radio',{name:'Interactive island',exact:false})).toBeChecked();
});

test('capture the Astro flow and file inspector for independent pixel review', async ({page}, testInfo) => {
  await page.goto('/');
  await page.getByRole('link',{name:'Follow this page into the browser',exact:false}).click();
  const flow = page.locator('#astro-flow');
  await flow.getByRole('radio',{name:'Interactive island',exact:false}).check();
  await flow.getByRole('button',{name:'Use the page',exact:true}).click();
  await flow.screenshot({path:testInfo.outputPath('astro-flow.png'),animations:'disabled'});
});
