import {test, expect} from '@playwright/test';

test('menu animates on every opening and keeps modal behavior through exit',async({page})=>{
 await page.setViewportSize({width:910,height:876});await page.goto('/');
 const trigger=page.getByRole('button',{name:'Menu',exact:true});
 const menu=page.locator('#mobile-menu');
 await trigger.click();await expect(menu).toBeVisible();
 await expect(menu).toHaveCSS('animation-name','menu-reveal');
 const links=menu.locator('.mobile-links a');
 expect(await links.last().evaluate(el=>parseFloat(getComputedStyle(el).animationDelay))).toBeGreaterThan(await links.first().evaluate(el=>parseFloat(getComputedStyle(el).animationDelay)));
 await page.waitForTimeout(1100);
 await links.first().hover();
 await page.screenshot({path:'reports/menu-animated-desktop.png'});
 await page.keyboard.press('Escape');
 await expect(menu).toHaveClass(/is-closing/);
 expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await expect(menu).not.toBeVisible();await expect(trigger).toBeFocused();
 expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await trigger.click();await expect(menu).toHaveCSS('animation-name','menu-reveal');
 await menu.getByRole('link',{name:/02 Skills/}).click();
 await expect(menu).not.toBeVisible();
 await expect.poll(()=>page.locator('#skills').evaluate(el=>{
   const expected=90+parseFloat(getComputedStyle(el).scrollMarginTop)+parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
   return Math.abs(el.getBoundingClientRect().top-expected);
 }),{timeout:5000}).toBeLessThan(2);
});

test('menu honors reduced motion on touch and closes without an animated delay',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 const page=await context.newPage();await page.goto('/');
 await page.getByRole('button',{name:'Menu',exact:true}).tap();
 const menu=page.locator('#mobile-menu');await expect(menu).toBeVisible();
 await expect(menu).toHaveCSS('animation-name','none');
 await expect(menu.locator('.mobile-links a').first()).toHaveCSS('animation-name','none');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.screenshot({path:'reports/menu-mobile.png'});
 await menu.getByRole('button',{name:/Close/}).tap();await expect(menu).not.toBeVisible();
 await context.close();
});
