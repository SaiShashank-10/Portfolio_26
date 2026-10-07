import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('project index previews on hover and keyboard, then opens the exact project',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');const index=page.locator('.hero-project-index');
 await index.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.mouse.move(1,1);await page.waitForTimeout(800);
 await expect(page.locator('.hero-ticker')).toHaveCount(0);await expect(page.locator('#hero .hero-projects')).toHaveCount(0);
 const tabs=index.getByRole('tab');await tabs.nth(1).hover();await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
 await expect(index.locator('.hero-project-summary')).toContainText('library bottlenecks');
 await tabs.nth(1).focus();await page.keyboard.press('ArrowRight');await expect(tabs.nth(2)).toBeFocused();
 await expect(index.getByRole('link',{name:'Explore project: PixelPulse'})).toBeVisible();
 await page.waitForTimeout(700);
 const error=await index.locator('.hero-project-tabs').evaluate(el=>{const a=el.querySelector('[aria-selected="true"]')!.getBoundingClientRect(),b=el.querySelector('.hero-project-underline')!.getBoundingClientRect();return Math.abs(a.x-b.x)+Math.abs(a.width-b.width);});expect(error).toBeLessThan(2);
 await page.screenshot({path:'reports/hero-project-index-desktop.png'});
 const scan=await new AxeBuilder({page}).include('.hero-project-index').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
 await index.getByRole('link',{name:'Explore project: PixelPulse'}).click();await expect(page.locator('#project-pixelpulse')).not.toHaveAttribute('inert');
 await expect.poll(()=>page.locator('#work').evaluate(el=>Math.abs(el.getBoundingClientRect().top-220)),{timeout:5000}).toBeLessThan(3);
});
test('project index supports mobile tapping, reduced motion and narrow layouts',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const page=await context.newPage();await page.goto('/');const index=page.locator('.hero-project-index');
 await index.getByRole('tab').nth(1).tap();await expect(index.getByRole('tab').nth(1)).toHaveAttribute('aria-selected','true');
 await expect(index.locator('.hero-project-detail')).toHaveCSS('transform','none');
 await index.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await page.screenshot({path:'reports/hero-project-index-mobile.png'});
 for(const width of [360,390,768,1098,1440,1920]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);expect(await index.locator('.hero-project-panel').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);}
 await page.setViewportSize({width:390,height:844});await index.getByRole('link',{name:'Explore project: Gen-Lib'}).tap();await expect(page.locator('#project-genlib')).not.toHaveAttribute('inert');await context.close();
});
