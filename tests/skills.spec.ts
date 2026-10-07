import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const closeSkillPopup = async (page: import('@playwright/test').Page) => { await page.getByRole('button',{name:'Close skill details'}).click(); await expect(page.locator('#skill-detail-dialog')).toHaveCount(0); };
test('stack filters, keyboard selection and project links stay coordinated',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const section=page.locator('#skills');await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));await page.mouse.move(1,1);
 await section.getByRole('button',{name:/^Languages/}).click();
 await expect(section.locator('.family-filters button.selected')).toHaveAttribute('aria-pressed','true');
 await expect(section.locator('.element.dimmed')).not.toHaveCount(0);
 await page.waitForTimeout(700);
 const error=await section.locator('.family-filters').evaluate(el=>{const a=el.querySelector('.selected')!.getBoundingClientRect(),b=el.querySelector('.family-marker')!.getBoundingClientRect();return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.width-b.width);});expect(error).toBeLessThan(2);
 await section.getByRole('button',{name:'Python, Languages',exact:true}).focus();await expect(section.locator('h3')).toHaveText('Python');
 await page.keyboard.press('ArrowRight');await expect(section.locator('h3')).toHaveText('SQL');
 await section.getByRole('button',{name:'All elements',exact:true}).click();
 await section.getByRole('button',{name:'React.js, Frontend',exact:true}).hover();await expect(section.locator('h3')).toHaveText('React.js');
 await page.waitForTimeout(800);await section.screenshot({path:'reports/skills-premium-desktop.png'});
 const issues=await new AxeBuilder({page}).include('#skills').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(issues.violations).toEqual([]);
 await section.locator('.inspector-projects').getByRole('link',{name:/DevPool/}).click();await expect(page.locator('#project-devpool')).not.toHaveAttribute('inert');
});
test('stack remains readable at narrow sizes and supports touch and reduced motion',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const page=await context.newPage();await page.goto('/');
 const section=page.locator('#skills');await section.getByRole('button',{name:'Python, Languages',exact:true}).tap();await closeSkillPopup(page);await expect(section.locator('h3')).toHaveText('Python');
 await section.locator('.mobile-skill-selection a').tap();await expect(section.locator('.inspector-body')).toHaveCSS('animation-name','none');
 await page.screenshot({path:'reports/skills-premium-mobile-inspector.png'});
 for(const width of [360,390,768,1024,1440,1920]){
 await page.setViewportSize({width,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
 const clipped=await section.locator('.element').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1).map(el=>el.getAttribute('aria-label')));expect(clipped).toEqual([]);
 }
 await page.setViewportSize({width:390,height:844});await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));await section.screenshot({path:'reports/skills-premium-mobile.png'});
 await context.close();
});

test('every element exposes a labelled external documentation or learning link', async ({page,context})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const tiles=page.locator('#skills .element');
 for(let i=0;i<await tiles.count();i++){
  await tiles.nth(i).focus();
  const selected=await page.locator('#skill-inspector h3').textContent();
  const link=page.locator('.skill-doc-link');
  await expect(link).toHaveAttribute('href',/^https:\/\//);
  await expect(link).toHaveAttribute('target','_blank');
  await expect(link).toHaveAttribute('rel','noopener noreferrer');
  expect(await link.getAttribute('aria-label')).toContain(selected);
  expect(await link.getAttribute('aria-label')).toContain('opens in a new tab');
 }
 await page.getByRole('button',{name:'HTML, Frontend',exact:true}).focus();
 const link=page.locator('.skill-doc-link');await expect(link).toHaveAttribute('href','https://developer.mozilla.org/en-US/docs/Web/HTML');
 await page.mouse.move(1,1);await page.locator('#skill-inspector').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(600);
 await page.screenshot({path:'reports/skill-docs-desktop.png'});
 const scan=await new AxeBuilder({page}).include('#skill-inspector').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
 await context.route('https://developer.mozilla.org/**',route=>route.fulfill({contentType:'text/html',body:'<title>Documentation destination test</title>'}));
 await link.focus();const opened=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await opened;await popup.waitForLoadState();expect(popup.url()).toBe('https://developer.mozilla.org/en-US/docs/Web/HTML');await popup.close();
 await page.setViewportSize({width:390,height:844});await page.locator('#skill-inspector').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.screenshot({path:'reports/skill-docs-mobile.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 expect(await link.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
});

test('pinned skills survive crossing other tiles and support keyboard switching',async({page,context})=>{
 await page.setViewportSize({width:1098,height:876});await page.goto('/');
 const section=page.locator('#skills');const inspector=page.locator('#skill-inspector');
 const fast=section.getByRole('button',{name:'FastAPI, Backend',exact:true});
 await fast.click();await closeSkillPopup(page);await expect(inspector).toHaveClass(/is-pinned/);
 await expect(inspector.getByRole('button',{name:'Unpin selected skill'})).toHaveAttribute('aria-pressed','true');
 for(const name of ['Node.js, Backend','Supabase, Backend','CSS, Frontend']){
  await section.getByRole('button',{name,exact:true}).hover();await expect(inspector.locator('h3')).toHaveText('FastAPI');
 }
 const link=inspector.locator('.skill-doc-link');await expect(link).toHaveAttribute('href','https://fastapi.tiangolo.com/');
 await context.route('https://fastapi.tiangolo.com/**',route=>route.fulfill({contentType:'text/html',body:'<title>Docs navigation test</title>'}));
 const opened=page.waitForEvent('popup');await link.click();const popup=await opened;await popup.waitForLoadState();expect(popup.url()).toBe('https://fastapi.tiangolo.com/');await popup.close();
 await fast.focus();await page.keyboard.press('ArrowRight');await expect(inspector.locator('h3')).toHaveText('FastAPI');
 await page.keyboard.press('Space');await closeSkillPopup(page);await expect(inspector.locator('h3')).toHaveText('Node.js');await expect(inspector).toHaveClass(/is-pinned/);
 await page.keyboard.press('Tab');await expect(inspector.getByRole('button',{name:'Unpin selected skill'})).toBeFocused();
 await page.keyboard.press('Tab');await expect(inspector.locator('.skill-doc-link')).toBeFocused();
 await inspector.getByRole('button',{name:'Unpin selected skill'}).click();await expect(inspector).not.toHaveClass(/is-pinned/);
 await fast.hover();await expect(inspector.locator('h3')).toHaveText('FastAPI');await fast.click();await closeSkillPopup(page);
 await page.mouse.move(1,1);await inspector.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(600);
 await page.screenshot({path:'reports/skills-pinned-selection.png'});
 const issues=await new AxeBuilder({page}).include('#skills').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(issues.violations).toEqual([]);
 await section.getByRole('button',{name:/^Languages/}).click();await expect(inspector).not.toHaveClass(/is-pinned/);await expect(inspector.locator('h3')).toHaveText('Java');
});
