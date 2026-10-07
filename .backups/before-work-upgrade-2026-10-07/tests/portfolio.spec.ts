import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("responsive screenshots and no document overflow", async ({ page }) => {
  await mkdir("reports", { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto("/");
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(400);
    expect(
      await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: innerWidth,
      })),
    ).toEqual({ scroll: width, viewport: width });
    for (const id of [
      "about",
      "skills",
      "work",
      "certifications",
      "experience",
      "achievements",
      "contact",
    ]) {
      await page
        .locator(`#${id}`)
        .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
      await page.waitForTimeout(100);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    }
    if (width === 390 || width === 1440) {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `reports/hero-${width}.png` });
      await page.screenshot({
        path: `reports/page-${width}.png`,
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
});

test("hero sound, visibility pause, playback control and loop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const video = page.locator("video");
  await expect
    .poll(() => video.evaluate((v) => !(v as HTMLVideoElement).paused))
    .toBe(true);
  if (!(await video.evaluate((v) => (v as HTMLVideoElement).muted)))
    await page.locator(".sound-control").click();
  await page.locator(".sound-control").click();
  await expect(video).toHaveJSProperty("muted", false);
  await page
    .locator("#skills")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect(video).toHaveJSProperty("paused", true);
  // Return through the actual navigation so Lenis and browser focus stay in sync.
  await page.locator('.identity').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(1);
  await expect(video).toHaveJSProperty("paused", false);
  await page.locator(".sound-control").click();
  await expect(video).toHaveJSProperty("muted", true);
  await video.evaluate((el) => {
    const v = el as HTMLVideoElement;
    v.currentTime = v.duration - 0.3;
  });
  await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime)).toBeLessThan(2);
  await page.locator(".motion-control").click();
  await expect(video).toHaveJSProperty("paused", true);
});

test("keyboard controls, skill inspector, accordion, copy, pinned gallery", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const card = page.locator(".id-card");
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await page
    .getByRole("button", { name: "Python, Languages", exact: true })
    .focus();
  await expect(page.locator(".skill-inspector h3")).toHaveText("Python");
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.skill-inspector h3')).toHaveText('SQL');
  await page.getByRole("button", { name: /^Languages/ }).click();
  await expect(page.locator(".element.dimmed")).not.toHaveCount(0);
  await page.getByRole('button', {name:'Next project', exact:true}).click();
  await expect(page.locator('#project-genlib')).not.toHaveAttribute('inert');
  await page.locator('.project-index').getByRole('button', {name: /PixelPulse/}).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#project-pixelpulse')).not.toHaveAttribute('inert');
  await expect(page.locator('#project-pixelpulse .project-github')).toHaveAttribute('href', 'https://github.com/SaiShashank-10/pixelpulse-frontend');
  const second = page.locator(".project-spine").nth(1);
  await second.focus();
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#project-genlib")).not.toHaveAttribute("inert");
  await page
    .locator("#achievements")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(300);
  const before = await page
    .locator(".award-track")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.wheel(0, 450);
  await page.waitForTimeout(1200);
  const after = await page
    .locator(".award-track")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(before).not.toEqual(after);
  await page
    .locator("#contact")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copied ✓" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "shashankvakkalanka@gmail.com",
  );
});

test("mobile menu, escape, touch card and reduced motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .locator(".id-card")
    .evaluate((el) =>
      el.scrollIntoView({ behavior: "instant", block: "center" }),
    );
  await page.locator(".id-card").tap({ force: true });
  await expect(page.locator(".id-card")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.waitForTimeout(1100);
  await page.locator(".id-card").tap({ force: true });
  await expect(page.locator(".id-card")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("video")).toHaveJSProperty("paused", true);
  expect(
    await page
      .locator(".achievement-pin")
      .evaluate((el) => getComputedStyle(el).position),
  ).not.toBe("sticky");
  await context.close();
});

test("WCAG accessibility scan", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});
