import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const ids=['devpool','genlib','pixelpulse','nethra','hotel'];
test('work hover expands panels, remains stable and preserves keyboard access',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');const section=page.locator('#work');await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));
 const index=section.locator('.project-index');await index.getByRole('button',{name:/Gen-Lib/}).hover();await expect(section.locator('#project-devpool')).not.toHaveAttribute('inert');
 await index.getByRole('button',{name:/Gen-Lib/}).focus();await expect(section.locator('#project-devpool')).not.toHaveAttribute('inert');await page.keyboard.press('Enter');await expect(section.locator('#project-genlib')).not.toHaveAttribute('inert');
 for(const id of ids){await index.locator('button').nth(ids.indexOf(id)).click();await expect(section.locator(`#project-${id}`)).not.toHaveAttribute('inert');}
 await index.getByRole('button',{name:/DevPool/}).click();await page.mouse.move(1,1);await page.waitForTimeout(1200);
 const delta=await index.evaluate(el=>{const a=el.querySelector('[aria-pressed="true"]')!.getBoundingClientRect(),b=el.querySelector('.project-index-marker')!.getBoundingClientRect();return Math.abs(a.x-b.x)+Math.abs(a.width-b.width);});expect(delta).toBeLessThan(2);
 await section.screenshot({path:'reports/work-upgraded-desktop.png'});
 const scan=await new AxeBuilder({page}).include('#work').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
 for(const i of [1,2,3,4,0]){
  await section.locator('.project-spine').nth(i).hover();
  await expect(section.locator(`#project-${ids[i]}`)).not.toHaveAttribute('inert');
  await page.waitForTimeout(1100);
  await expect(section.locator(`#project-${ids[i]}`)).not.toHaveAttribute('inert');
 }
 await page.mouse.move(1,1);
 await section.locator('.project-spine').nth(2).focus();await page.keyboard.press('Enter');
 await expect(index.getByRole('button',{name:/PixelPulse/})).toBeFocused();await expect(section.locator('#project-pixelpulse')).not.toHaveAttribute('inert');await expect(section.locator('#project-pixelpulse .project-github')).toHaveAttribute('href','https://github.com/SaiShashank-10/pixelpulse-frontend');
});
test('every project fits narrow and wide screens, including illustration and all technologies',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const page=await context.newPage();await page.goto('/');const section=page.locator('#work');
 for(const width of [360,390,768,1098,1200,1440,1920]){
  await page.setViewportSize({width,height:900});
  for(let i=0;i<ids.length;i++){
   await section.locator('.project-index button').nth(i).tap();const detail=section.locator(`#project-${ids[i]}`);
   await expect(detail).not.toHaveAttribute('inert');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
   const clipped=await detail.evaluate(el=>{const parent=el.getBoundingClientRect();return [...el.querySelectorAll('.project-copy,.project-description,.project-features,.project-tech,.project-visual,.mock-window')].filter(child=>{const r=child.getBoundingClientRect();return r.right>parent.right+2||r.bottom>parent.bottom+2||child.scrollWidth>child.clientWidth+2;}).map(child=>child.className);});expect(clipped).toEqual([]);
   await expect(detail.locator('.project-visual')).toBeVisible();await expect(detail.locator('.project-visual')).toHaveCSS('animation-name','none');
  }
 }
 await page.setViewportSize({width:390,height:844});await section.locator('.project-spine').nth(1).tap();await section.locator('#project-genlib').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await page.screenshot({path:'reports/work-upgraded-mobile.png'});await context.close();
});
