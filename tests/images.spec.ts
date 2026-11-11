import { expect, test } from "@playwright/test";

// On a retina screen (2x), every image should be downloaded at least as large as it's
// drawn, so nothing looks soft. Images are never enlarged past their original size,
// so the check allows for that.
test.use({ deviceScaleFactor: 2 });
test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop-chrome", "desktop at 2x"));

async function check(page: import("@playwright/test").Page, selector: string) {
  const imgs = page.locator(selector);
  const n = await imgs.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const img = imgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
      .toBe(true);
    const r = await img.evaluate(async (el: HTMLImageElement) => {
      const box = el.getBoundingClientRect();
      const fit = getComputedStyle(el).objectFit;
      // naturalWidth is scaled by the srcset density, so load the chosen file on its own to count real pixels.
      const probe = new Image();
      probe.src = el.currentSrc;
      await probe.decode();
      const aspect = probe.naturalWidth / probe.naturalHeight;
      // With object-fit: cover, the picture is scaled to fill the taller side.
      const drawn = fit === "cover" ? Math.max(box.width, box.height * aspect) : box.width;
      // And the original file, which is as large as it can ever get.
      const original = new Image();
      original.src = new URL(el.currentSrc).searchParams.get("url") ?? el.currentSrc;
      await original.decode();
      return {
        drawn,
        got: probe.naturalWidth,
        original: original.naturalWidth,
        src: el.currentSrc,
      };
    });
    const needed = Math.min(r.drawn * 2 * 0.95, r.original);
    expect(r.got, `${r.src} drawn at ${Math.round(r.drawn)}px`).toBeGreaterThanOrEqual(needed);
  }
}

test("photos, portrait and report pages are sharp at 2x", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ru_intro_seen", "1"));
  await page.goto("/");
  await check(page, "#life .gtile img");
  await check(page, "#about img");
  await check(page, "article.stackcard img");
});

test("images ask for quality 90", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("ru_intro_seen", "1"));
  await page.goto("/");
  const src = await page.locator("#about img").getAttribute("src");
  expect(src).toContain("q=90");
});
