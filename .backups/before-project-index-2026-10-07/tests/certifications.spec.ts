import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('certificate preview follows hover and keyboard, retains selection, and handles rapid changes', async ({page}) => {
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/');
 const section=page.locator('#certifications');
 await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));
 const rows=section.locator('.certification-row');
 const preview=section.locator('.folio-course');
 await expect(preview).toHaveText('Data Analytics with Python');
 await rows.nth(1).hover();
 await expect(preview).toHaveText('Data Science for Engineers');
 await expect(section.locator('.folio-distinction')).toHaveText('Elite · 67%');
 await rows.nth(2).getByRole('button').focus();
 await expect(preview).toHaveText('AI Foundations Associate');
 await expect(section.locator('.folio-title')).toHaveText('Oracle');
 await page.mouse.move(10,100);
 await expect(preview).toHaveText('AI Foundations Associate');
 await rows.nth(0).hover();await rows.nth(1).hover();await rows.nth(2).hover();
 await expect(preview).toHaveText('AI Foundations Associate');
 await expect(section.locator('.folio-front')).toHaveClass(/flip-idle/);
 await expect.poll(() => section.locator('.folio-front').evaluate(el => el.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
 await page.waitForTimeout(650); // Allow the ink flood on previously hovered rows to settle for the screenshot.
 await page.screenshot({path:'reports/certificate-flip-desktop.png'});
 const result=await new AxeBuilder({page}).include('#certifications').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(result.violations).toEqual([]);
});

test('certificate preview supports touch and reduced motion', async ({browser}) => {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();await page.goto('/');
 const section=page.locator('#certifications');
 await section.getByRole('button',{name:'AI Foundations Associate',exact:true}).tap();
 await expect(section.locator('.folio-course')).toHaveText('AI Foundations Associate');
 await expect(section.locator('.folio-front')).toHaveCSS('transform','none');
 await expect(section.locator('.certification-folio')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await section.locator('.certification-folio').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await page.screenshot({path:'reports/certificate-flip-mobile.png'});
 await context.close();
});
