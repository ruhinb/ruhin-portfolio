import { expect, test, type Page } from "@playwright/test";

const skipIntro = (page: Page) =>
  page.addInitScript(() => {
    sessionStorage.setItem("ru_intro_seen", "1");
    sessionStorage.setItem("ru_case_discount", "1");
  });

test.describe("search and sharing", () => {
  test("robots.txt and the sitemap point at the live domain", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Sitemap: https://rubaiyat.dev/sitemap.xml");
    expect(robots).toContain("Disallow: /api/");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["", "/projects/patientcare", "/projects/discount", "/projects/slice"]) {
      expect(sitemap).toContain(`<loc>https://rubaiyat.dev${path}</loc>`);
    }
  });

  test("every page has a link preview image", async ({ page, request }) => {
    for (const [path, type] of [
      ["/", "image/jpeg"],
      ["/projects/discount", "image/png"],
    ] as const) {
      await page.goto(path);
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(og).toMatch(/^https:\/\/rubaiyat\.dev\//);
      const res = await request.get(new URL(og!).pathname + new URL(og!).search);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toBe(type);
      // WhatsApp skips previews larger than about 300 KB.
      expect((await res.body()).length).toBeLessThan(300_000);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://rubaiyat.dev${path === "/" ? "" : path}`,
      );
    }
  });

  test("Google gets structured data about Ru", async ({ page }) => {
    await page.goto("/");
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const person = JSON.parse(json!);
    expect(person["@type"]).toBe("Person");
    expect(person.sameAs).toContain("https://github.com/ruhinb");
  });
});

test.describe("privacy and visitor stats", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
    // Never load the real stats script in tests; record events instead.
    await page.route("**/u/s.js", (r) =>
      r.fulfill({ contentType: "text/javascript", body: "/* stub */" }),
    );
    await page.addInitScript(() => {
      const w = window as unknown as {
        events: [string, unknown][];
        umami: { track: (e: string, d?: unknown) => void };
      };
      w.events = [];
      w.umami = { track: (e, d) => w.events.push([e, d]) };
    });
  });

  const events = (page: Page) =>
    page.evaluate(() => (window as unknown as { events: [string, unknown][] }).events);

  test("the privacy page is linked from the footer", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("link", { name: "Privacy", exact: true }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
    await expect(page.getByText("Umami sets no cookies")).toBeVisible();
  });

  test("key actions are counted", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Resume" }).first().click();
    await expect(page.getByRole("dialog", { name: "Resume" })).toBeVisible();
    await page.getByRole("button", { name: "Close resume" }).click();

    // The contact section sits under the sliding sheet until the page reaches the bottom.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("button", { name: "Copy", exact: true }).click();

    await expect
      .poll(() => events(page))
      .toEqual([
        ["Open resume", undefined],
        ["Copy email", undefined],
      ]);

    await expect(page.getByRole("link", { name: "LinkedIn ↗" })).toHaveAttribute(
      "data-umami-event",
      "Open LinkedIn",
    );
  });

  test("reading a case study to the end is counted once", async ({ page }) => {
    await page.goto("/projects/discount");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(() => events(page))
      .toEqual([["Read case study to end", { project: "discount" }]]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    expect(await events(page)).toHaveLength(1);
  });
});

// The last pass across screen sizes: nothing may stick out sideways and cause sideways scrolling.
test.describe("every screen size", () => {
  const widths = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];

  for (const path of ["/", "/projects/patientcare", "/projects/slice", "/privacy", "/nope"]) {
    test(`no sideways scrolling on ${path}`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop-chrome", "resizes the window itself");
      await skipIntro(page);
      for (const width of widths) {
        await page.setViewportSize({ width, height: width < 760 ? 800 : 900 });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
