import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('skill popup animates, traps focus, retains selection and restores tile focus',async({page,context})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 const tile=page.getByRole('button',{name:'FastAPI, Backend',exact:true});await tile.focus();await page.keyboard.press('Enter');
 const modal=page.locator('#skill-detail-dialog');await expect(modal).toBeVisible();await expect(modal.getByRole('heading')).toHaveText('FastAPI');
 await expect(modal.getByRole('button',{name:'Close skill details'})).toBeFocused();
 expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await page.keyboard.press('Shift+Tab');expect(await page.evaluate(()=>document.querySelector('#skill-detail-dialog')!.contains(document.activeElement))).toBe(true);
 await page.waitForTimeout(600);await page.screenshot({path:'reports/skill-popup-desktop.png'});
 const scan=await new AxeBuilder({page}).include('#skill-detail-dialog').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
 await context.route('https://fastapi.tiangolo.com/**',route=>route.fulfill({contentType:'text/html',body:'<title>Documentation target</title>'}));
 const opened=page.waitForEvent('popup');await modal.locator('.skill-doc-link').click();const popup=await opened;await popup.waitForLoadState();expect(popup.url()).toBe('https://fastapi.tiangolo.com/');await popup.close();
 await page.keyboard.press('Escape');await expect(modal).toHaveClass(/is-closing/);expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await expect(modal).toHaveCount(0);await expect(tile).toBeFocused();await expect(page.locator('#skill-inspector h3')).toHaveText('FastAPI');await expect(page.locator('#skill-inspector')).toHaveClass(/is-pinned/);
 expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await page.keyboard.press('Enter');await expect(modal).toBeVisible();await page.mouse.click(5,5);await expect(modal).toHaveCount(0);
 await page.keyboard.press('Enter');await expect(modal).toBeVisible();await modal.getByRole('link',{name:'PixelPulse',exact:true}).click();await expect(modal).toHaveCount(0);await expect(page.locator('#project-pixelpulse')).not.toHaveAttribute('inert');
 await expect.poll(()=>page.locator('#work').evaluate(el=>Math.abs(el.getBoundingClientRect().top-220)),{timeout:5000}).toBeLessThan(3);
});
test('skill popup fits touch screens, scrolls internally and respects reduced motion',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const page=await context.newPage();await page.goto('/');
 const tile=page.getByRole('button',{name:'Python, Languages',exact:true});await tile.tap();const modal=page.locator('#skill-detail-dialog');await expect(modal).toBeVisible();await expect(modal.getByRole('heading')).toHaveText('Python');
 await expect(modal.locator('.skill-dialog-card')).toHaveCSS('animation-name','none');await page.screenshot({path:'reports/skill-popup-mobile.png'});
 for(const viewport of [{width:360,height:640},{width:667,height:375}]){await page.setViewportSize(viewport);const box=await modal.locator('.skill-dialog-card').boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.y).toBeGreaterThanOrEqual(0);expect(box!.y+box!.height).toBeLessThanOrEqual(viewport.height);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(viewport.width);}
 await modal.locator('.skill-dialog-card').evaluate(el=>{el.scrollTop=el.scrollHeight;});await expect(modal.getByRole('link',{name:'PixelPulse',exact:true})).toBeInViewport();
 await page.setViewportSize({width:390,height:844});await modal.getByRole('button',{name:'Close skill details'}).tap();await expect(modal).toHaveCount(0);await expect(tile).toBeFocused();await context.close();
});
