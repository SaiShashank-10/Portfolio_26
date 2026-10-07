import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('journey navigation drives current milestone and scroll progress',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 const section=page.locator('#experience');
 await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));
 const links=section.locator('.chapter-nav a');
 await links.nth(3).click();
 await expect(links.nth(3)).toHaveAttribute('aria-current','step');
 await expect(section.locator('.chapter-caption p')).toHaveText('Community');
 await expect(page.locator('#milestone-3')).toHaveClass(/is-current/);
 const progress=await section.evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--journey-progress')));
 expect(progress).toBeGreaterThan(.2);
 await links.nth(1).focus();await page.keyboard.press('Enter');
 await expect(links.nth(1)).toHaveAttribute('aria-current','step');
 await expect(page.locator('#milestone-1')).toHaveClass(/is-current/);
 await expect.poll(()=>section.evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--journey-progress')))).toBeLessThan(progress);
 await page.waitForTimeout(1100);
 await page.screenshot({path:'reports/journey-desktop.png'});
 const results=await new AxeBuilder({page}).include('#experience').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(results.violations).toEqual([]);
});

test('journey supports touch, reduced motion and narrow screens',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();await page.goto('/');
 const section=page.locator('#experience');
 await section.locator('.chapter-nav a').nth(5).tap();
 await expect(page.locator('#milestone-5')).toHaveClass(/is-current/);
 await expect(page.locator('#milestone-5 .timeline-detail')).toHaveCSS('transform','none');
 await expect(section.locator('.timeline-stop')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.screenshot({path:'reports/journey-mobile.png'});
 await context.close();
});
