import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('introduction card has usable face controls, swing and unclipped content', async ({page}) => {
 await page.setViewportSize({width:1440,height:1100});await page.goto('/');
 const about=page.locator('#about');await about.evaluate(el=>el.scrollIntoView({behavior:'instant'}));
 const controls=about.getByRole('group',{name:'ID card controls'});
 await controls.getByRole('button',{name:'Reverse',exact:true}).click();
 await expect(about.locator('.id-card')).toHaveAttribute('aria-pressed','true');
 await page.waitForTimeout(1100);
 await expect(about.locator('.id-back')).toHaveAttribute('aria-hidden','false');
 expect(await about.locator('.id-back').evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
 await page.screenshot({path:'reports/about-reverse-desktop.png'});
 await controls.getByRole('button',{name:'Front',exact:true}).click();
 await expect(about.locator('.id-card')).toHaveAttribute('aria-pressed','false');
 const strap=about.getByRole('button',{name:'Drag to swing the ID card, or use the arrow keys'});
 await strap.focus();await page.keyboard.press('ArrowRight');
 await expect.poll(()=>about.locator('.lanyard-hanger').evaluate(el=>Math.abs(parseFloat(el.style.getPropertyValue('--swing'))))).toBeGreaterThan(2);
 await controls.getByRole('button',{name:'Swing the ID card'}).click();
 await page.mouse.move(10,100);await page.waitForTimeout(1100);
 expect(await about.locator('.id-front').evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
 await page.screenshot({path:'reports/about-upgraded-desktop.png'});
 const results=await new AxeBuilder({page}).include('#about').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});

test('introduction controls support touch and remove decorative motion when requested',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 const page=await context.newPage();await page.goto('/');const about=page.locator('#about');
 const controls=about.getByRole('group',{name:'ID card controls'});
 await controls.getByRole('button',{name:'Reverse',exact:true}).tap();
 await expect(about.locator('.id-card')).toHaveAttribute('aria-pressed','true');
 await expect(controls.getByRole('button',{name:'Swing the ID card'})).toBeDisabled();
 await expect(about.locator('.lanyard-hanger')).toHaveCSS('transform','none');
 expect(await about.locator('.id-back').evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await about.locator('.lanyard-column').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
 await page.screenshot({path:'reports/about-upgraded-mobile.png'});
 await page.setViewportSize({width:360,height:844});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(controls.getByRole('button',{name:'Swing the ID card'})).toBeEnabled();
 await controls.getByRole('button',{name:'Swing the ID card'}).tap();
 for(let i=0;i<8;i++){await page.waitForTimeout(100);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(360);}
 await context.close();
});

test('hover flip remains stable at the edge throughout the rotation', async ({page}) => {
 await page.setViewportSize({width:905,height:876});
 await page.goto('/');
 const zone=page.locator('.id-hover-zone');
 await zone.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
 await page.mouse.move(10,100);
 await page.waitForTimeout(500);
 const box=await zone.boundingBox();
 if(!box) throw new Error('Missing card hover area');
 const card=page.locator('.id-card');
 await page.mouse.move(box.x+24,box.y+box.height/2);
 for(let i=0;i<12;i++) {
   await page.waitForTimeout(100);
   await expect(card).toHaveAttribute('aria-pressed','true');
 }
 await expect(page.locator('.id-back')).toHaveAttribute('aria-hidden','false');
 await page.screenshot({path:'reports/about-smooth-hover.png'});
 await page.mouse.move(10,100);
 await expect(card).toHaveAttribute('aria-pressed','false');
 await page.waitForTimeout(1000);
 expect(await card.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m11)).toBeCloseTo(1,2);
 await page.mouse.move(box.x+24,box.y+box.height/2);
 await page.waitForTimeout(150);
 await page.mouse.move(10,100);
 await page.waitForTimeout(100);
 await page.mouse.move(box.x+24,box.y+box.height/2);
 await page.waitForTimeout(1000);
 await expect(card).toHaveAttribute('aria-pressed','true');
 expect(await card.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m11)).toBeCloseTo(-1,2);
});
