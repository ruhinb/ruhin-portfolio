import { expect, test, type Page } from "@playwright/test";

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 760;

// Skip the loader for most tests by marking it as already seen this session.
async function skipIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("ru_intro_seen", "1"));
}

test.describe("loader", () => {
  test("plays on the first visit, not again in the same session", async ({ page }) => {
    await page.goto("/");
    const loader = page.locator(".loader");
    await expect(loader).toBeVisible();
    await expect(page.locator("html")).not.toHaveClass(/intro-seen/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/intro-seen/);
    await expect(loader).toBeHidden();
  });

  test("is skipped for visitors who ask for less motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".loader")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test.beforeEach(async ({ page }) => skipIntro(page));

  test("desktop links scroll to each section and highlight it", async ({ page }) => {
    test.skip(isPhone(page), "desktop navigation");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Sections" }).first();
    for (const [label, id] of [
      ["About", "about"],
      ["Experience", "experience"],
      ["Projects", "work"],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute(
        "aria-current",
        "location",
      );
      await expect
        .poll(() =>
          page.locator(`#${id}`).evaluate((el) => Math.abs(el.getBoundingClientRect().top)),
        )
        .toBeLessThan(40);
      await expect(page.locator(`#${id}`)).toBeFocused();
    }
    await nav.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(nav.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await expect(page.getByRole("heading", { name: "Let's talk." })).toBeInViewport();

    await page.getByRole("link", { name: "Back to top", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });

  test("phone bar and menu reach every section", async ({ page }) => {
    test.skip(!isPhone(page), "phone navigation");
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Sections" }).last();
    await expect(bar.getByRole("link", { name: "Projects" })).toBeVisible();

    const menuBtn = page.getByRole("button", { name: "All sections" });
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");

    await menuBtn.click();
    await page.locator("#msheet").getByRole("link", { name: "Experience" }).click();
    await expect(page.locator("#msheet")).toBeHidden();
    await expect
      .poll(() => page.locator("#experience").evaluate((el) => el.getBoundingClientRect().top))
      .toBeLessThan(40);
  });
});

test.describe("sections", () => {
  test.beforeEach(async ({ page }) => skipIntro(page));

  test("experience rows open one at a time", async ({ page }) => {
    await page.goto("/");
    const analyst = page.getByRole("button", { name: /Data Analyst/ });
    const barista = page.getByRole("button", { name: /Barista/ });
    await expect(analyst).toHaveAttribute("aria-expanded", "true");
    await expect(barista).toHaveAttribute("aria-expanded", "false");

    await barista.click();
    await expect(barista).toHaveAttribute("aria-expanded", "true");
    await expect(analyst).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText(/zero cash discrepancies/)).toBeVisible();

    await barista.click();
    await expect(barista).toHaveAttribute("aria-expanded", "false");
  });

  test("email link works and Copy confirms", async ({ page, context, browserName }) => {
    if (browserName === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto("/");
    // Contact sits under the page and is uncovered at the very bottom, as a visitor would scroll.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const email = page.locator("a.email");
    await expect(email).toHaveAttribute("href", "mailto:rubaiyatalam.ruhin@gmail.com");
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByRole("button", { name: "Copied ✓" })).toBeVisible();
    if (browserName === "chromium") {
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        "rubaiyatalam.ruhin@gmail.com",
      );
    }
    await expect(page.getByRole("button", { name: "Copy" })).toBeVisible({ timeout: 4000 });
  });

  test("the address isn't written whole in the page's HTML", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).not.toContain("rubaiyatalam.ruhin@gmail.com");
  });

  test("hero line ends at the yellow dot", async ({ page }) => {
    await page.goto("/");
    const svg = await page.locator("svg.draw").boundingBox();
    const dot = await page.locator(".dotin").boundingBox();
    expect(svg && dot).toBeTruthy();
    // The path ends at x = 1330/1440 and y = 70/300 of the drawing.
    const endX = svg!.x + (svg!.width * 1330) / 1440;
    const endY = svg!.y + (svg!.height * 70) / 300;
    expect(Math.abs(dot!.x + dot!.width / 2 - endX)).toBeLessThan(3);
    expect(Math.abs(dot!.y + dot!.height / 2 - endY)).toBeLessThan(3);
  });
});

test.describe("scroll motion fallback", () => {
  test("works in browsers without scroll timelines", async ({ page }) => {
    await skipIntro(page);
    await page.addInitScript(() => {
      // Runs before <html> exists, so wait for it.
      const add = () => document.documentElement?.classList.add("motion-js");
      if (document.documentElement) add();
      else document.addEventListener("readystatechange", add, { once: true });
    });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    const fact = page.locator("#about dl.rv");
    await fact.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect
      .poll(() => fact.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.9);
    expect(errors).toEqual([]);
  });
});
