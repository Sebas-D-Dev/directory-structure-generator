import {test, expect, type Page} from '@playwright/test';
import {legacySections} from '../../src/domain/navigation.ts';

async function controlledClock(page: Page) {
  await page.clock.install({time:new Date('2026-10-14T12:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-14T12:00:01Z'));
}

test('opening story is readable immediately, pauses exactly, replays and ends without a loop', async ({page,isMobile}, testInfo) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await controlledClock(page);
  await page.goto('/');
  const story = page.locator('directory-story');
  const control = story.getByRole('button');
  const activate = async () => isMobile ? control.tap() : control.click();
  await expect(story).toHaveAttribute('data-state','playing');
  await expect(story).toHaveAttribute('data-beat','0');
  await expect(page.getByRole('heading',{level:1})).toHaveText('See how a projectfits together.');
  for (const label of ['does the work','checks the work','explains the project']) await expect(story.getByText(label,{exact:true})).toBeVisible();
  await expect(page.locator('#examples, #astro-flow, #rename-lab, #lesson')).toHaveCount(0);
  const cta = await page.locator('.landing-cta').boundingBox();
  expect(cta!.y + cta!.height).toBeLessThan(page.viewportSize()!.height);
  await page.screenshot({path:testInfo.outputPath('landing-initial.png'),animations:'allow'});
  await page.clock.runFor(1200);
  await activate();
  await expect(control).toHaveText('Resume story');
  await page.clock.runFor(10000);
  await expect(story).toHaveAttribute('data-beat','0');
  await expect(control).toBeFocused();
  await activate();
  await page.clock.runFor(1999);
  await expect(story).toHaveAttribute('data-beat','0');
  await page.clock.runFor(1);
  await expect(story).toHaveAttribute('data-beat','1');
  await page.clock.runFor(6400);
  await expect(story).toHaveAttribute('data-state','complete');
  await expect(control).toHaveText('Replay story');
  await page.clock.runFor(60000);
  await expect(story).toHaveAttribute('data-beat','3');
  await page.screenshot({path:testInfo.outputPath('landing-complete.png'),animations:'disabled'});
  await activate();
  await expect(story).toHaveAttribute('data-beat','0');
  await activate();
  await expect(story).toHaveAttribute('data-state','paused');
  await activate();
  await page.clock.runFor(9600);
  await expect(story).toHaveAttribute('data-state','complete');
});

test('runtime motion preference and page hiding cancel automatic progression without losing information', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await controlledClock(page);
  await page.goto('/');
  const story=page.locator('directory-story');
  await expect(story).toHaveAttribute('data-state','playing');
  await page.clock.runFor(1000);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  await expect(story).toHaveAttribute('data-state','paused');
  await page.clock.runFor(20000);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  await expect(story).toHaveAttribute('data-state','paused');
  await story.getByRole('button',{name:'Resume story'}).press('Enter');
  await page.clock.runFor(2200);
  await expect(story).toHaveAttribute('data-beat','1');
  await story.getByRole('button',{name:'Pause story'}).focus();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(story).toHaveAttribute('data-state','static');
  await expect(story.locator('figure')).toBeFocused();
  await expect(story.getByRole('button')).toHaveCount(0);
  await page.clock.runFor(20000);
  await expect(story).toHaveAttribute('data-beat','3');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(story).toHaveAttribute('data-state','complete');
  await page.clock.runFor(20000);
  await expect(story).toHaveAttribute('data-state','complete');
  await story.getByRole('button',{name:'Replay story'}).press('Space');
  await expect(story).toHaveAttribute('data-state','playing');
});

test('320px reduced-motion introduction is complete and keyboard navigation needs no story interaction', async ({page},testInfo) => {
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const story=page.locator('directory-story');
  await expect(story).toHaveAttribute('data-state','static');
  await expect(story).toHaveAttribute('data-beat','3');
  await expect(story.locator('.story-static-note')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(await page.evaluate(() => document.getAnimations().filter((item) => item.playState==='running').length)).toBe(0);
  await page.screenshot({path:testInfo.outputPath('landing-reduced-320.png'),animations:'disabled'});
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.landing-cta')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/examples\/$/);
});

test('320px autoplay preserves first-paint meaning and complete map without document overflow', async ({page,isMobile},testInfo) => {
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await controlledClock(page);
  await page.goto('/');
  await expect(page.locator('directory-story')).toHaveAttribute('data-state','playing');
  const cta = await page.locator('.landing-cta').boundingBox();
  const map = await page.locator('.directory-stage').boundingBox();
  const pause = await page.getByRole('button',{name:'Pause story'}).boundingBox();
  expect(cta!.y + cta!.height).toBeLessThan(740);
  expect(map!.y + map!.height).toBeLessThan(740);
  expect(pause!.y + pause!.height).toBeLessThan(740);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.screenshot({path:testInfo.outputPath('landing-initial-320.png'),animations:'allow'});
  await page.clock.runFor(9600);
  await expect(page.locator('directory-story')).toHaveAttribute('data-state','complete');
  await page.screenshot({path:testInfo.outputPath('landing-complete-320.png'),animations:'disabled'});
  if(isMobile) await page.locator('.landing-cta').tap(); else await page.locator('.landing-cta').click();
  await expect(page).toHaveURL(/\/examples\/$/);
});

test('separate routes link naturally and browser back and forward preserve the route', async ({page},testInfo) => {
  const errors:string[]=[];
  const remote:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4321')) remote.push(request.url());});
  await page.goto('/');
  await page.locator('.landing-cta').click();
  await page.screenshot({path:testInfo.outputPath('route-examples.png'),animations:'disabled'});
  await page.getByRole('link',{name:'Follow this page into the browser',exact:false}).click();
  await expect(page).toHaveURL(/\/examples\/astro\/$/);
  await expect(page.locator('#astro-flow')).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('route-astro.png'),animations:'disabled'});
  await page.goBack(); await expect(page).toHaveURL(/\/examples\/$/);
  await page.goForward(); await expect(page).toHaveURL(/\/examples\/astro\/$/);
  await page.getByRole('link',{name:'All examples',exact:false}).click();
  await page.getByRole('link',{name:'Explore this Go layout',exact:false}).click();
  await expect(page).toHaveURL(/\/examples\/go\/$/);
  await page.screenshot({path:testInfo.outputPath('route-go.png'),animations:'disabled'});
  await page.getByRole('link',{name:'optional Go naming lab',exact:true}).click();
  await expect(page).toHaveURL(/\/lab\/$/);
  await page.screenshot({path:testInfo.outputPath('route-lab.png'),animations:'disabled'});
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Sources',exact:true}).click();
  await expect(page).toHaveURL(/\/sources\/$/);
  await expect(page.getByRole('heading',{name:'Original examples, visible limits.'})).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('route-sources.png'),animations:'disabled'});
  await page.getByRole('link',{name:'Repository Structure Guide home'}).click();
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
  expect(errors).toEqual([]); expect(remote).toEqual([]);
});

test('legacy section hashes forward to valid targets without adding a back-button trap', async ({page}) => {
  for (const [hash,target] of Object.entries(legacySections)) {
    await page.goto(`/#${hash}`);
    await expect(page).toHaveURL(`http://127.0.0.1:4321${target}`);
    await expect(page.locator(`#${target.split('#')[1]}`)).toBeAttached();
  }
  await page.goto('/sources/');
  await page.goto('/#astro-flow');
  await expect(page).toHaveURL(/\/examples\/astro\/#astro-flow$/);
  await page.goBack(); await expect(page).toHaveURL(/\/sources\/$/);
  await page.goForward(); await expect(page).toHaveURL(/\/examples\/astro\/#astro-flow$/);
  await page.goto('/#%E0%A4%A');
  await expect(page.locator('directory-story')).toBeVisible();
  await expect(page).toHaveURL(/\/#%E0%A4%A$/);
  await page.evaluate(() => {window.location.hash='examples';});
  await expect(page).toHaveURL(/\/examples\/#examples$/);
});

test('without JavaScript the complete introduction, route links and default lessons are readable', async ({browser},testInfo) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4321/');
    await expect(page.locator('directory-story')).toHaveAttribute('data-state','static');
    await expect(page.locator('.story-static-note')).toBeVisible();
    await expect(page.getByRole('button')).toHaveCount(0);
    await page.screenshot({path:testInfo.outputPath('landing-no-js.png'),animations:'disabled'});
    await page.locator('.landing-cta').click();
    await expect(page.locator('.example-card')).toHaveCount(5);
    await page.getByRole('link',{name:'Follow this page into the browser',exact:false}).click();
    await expect(page.locator('#flow-step-heading')).toHaveText('A source path becomes a route');
    await page.getByText('Lesson assumptions and provenance',{exact:true}).click();
    await expect(page.locator('#astro-flow')).toContainText('illustrative fixture not executed');
    await page.goto('http://127.0.0.1:4321/examples/go/');
    await expect(page.locator('#inspector-heading')).toHaveText('main.go');
    await page.goto('http://127.0.0.1:4321/lab/');
    await expect(page.locator('.diagram-node').first()).toContainText('main.go');
    await page.goto('http://127.0.0.1:4321/sources/');
    await expect(page.locator('.source-list article')).not.toHaveCount(0);
  } finally { await context.close(); }
});


test('native file and connector motion pauses, resumes, completes and cancels with lifecycle changes', async ({page,isMobile}, testInfo) => {
  if (isMobile) await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  const story=page.locator('directory-story');
  const active=() => story.evaluate((element) => element.getAnimations({subtree:true}).filter((animation) => animation.playState === 'running').length);
  await expect(story).toHaveAttribute('data-state','playing');
  await expect.poll(active).toBeGreaterThan(0);
  await expect(story).toHaveAttribute('data-beat','1',{timeout:6000});
  await expect.poll(() => story.locator('.connector-marker').evaluate((element) => Number(element.getAnimations()[0]?.currentTime ?? 0))).toBeGreaterThan(3850);
  await story.getByRole('button',{name:'Pause story'}).click();
  await expect.poll(active).toBe(0);
  const paused=await story.evaluate((element) => element.getAnimations({subtree:true}).map((animation) => ({time:animation.currentTime,state:animation.playState})));
  expect(paused.some((animation) => animation.state==='paused')).toBe(true);
  // A real elapsed interval is deliberate: WAAPI runs on the document timeline, outside the fake timer clock.
  await page.waitForTimeout(250);
  expect(await story.evaluate((element) => element.getAnimations({subtree:true}).map((animation) => ({time:animation.currentTime,state:animation.playState})))).toEqual(paused);
  expect(await story.locator('.connector-marker').evaluate((element) => {
    const rect=element.getBoundingClientRect();
    return Number(getComputedStyle(element).opacity)>0 && document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2)===element;
  })).toBe(true);
  await page.screenshot({path:testInfo.outputPath('landing-middle-paused.png'),animations:'allow'});
  await story.getByRole('button',{name:'Resume story'}).click();
  await expect.poll(active).toBeGreaterThan(0);
  await expect(story).toHaveAttribute('data-state','complete',{timeout:8000});
  await expect.poll(active).toBe(0);
  await story.getByRole('button',{name:'Replay story'}).click();
  await expect(story).toHaveAttribute('data-beat','0');
  await expect.poll(active).toBeGreaterThan(0);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  await expect(story).toHaveAttribute('data-state','paused');
  await expect.poll(active).toBe(0);
  await story.getByRole('button',{name:'Resume story'}).click();
  await expect.poll(active).toBeGreaterThan(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(story).toHaveAttribute('data-state','static');
  expect(await story.evaluate((element) => element.getAnimations({subtree:true}).length)).toBe(0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(story).toHaveAttribute('data-state','complete');
  expect(await active()).toBe(0);
  await story.getByRole('button',{name:'Replay story'}).click();
  expect(await story.evaluate((element) => {element.remove(); return element.getAnimations({subtree:true}).length;})).toBe(0);
});

test('spatial map filenames stay unobscured at narrow, tablet and desktop breakpoints', async ({page},testInfo) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [320,768,1024]) {
    await page.setViewportSize({width,height:740});
    await page.goto('/');
    await expect(page.locator('directory-story')).toHaveAttribute('data-state','static');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const coverage=await page.locator('.story-tree code').evaluateAll((labels) => labels.map((label) => {
      const rect=label.getBoundingClientRect();
      return {name:label.textContent,unobscured:[rect.left+1,rect.left+rect.width/2,rect.right-1].every((x) => {
        const top=document.elementFromPoint(x,rect.top+rect.height/2);
        return top !== null && label.contains(top);
      })};
    }));
    for (const label of coverage) expect(label.unobscured,`${width}px ${label.name}`).toBe(true);
    if (width===768) await page.screenshot({path:testInfo.outputPath('landing-tablet-static.png'),animations:'allow'});
  }
});
