import { expect, test, type Page } from "@playwright/test";

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 760;
const skipIntro = (page: Page) =>
  page.addInitScript(() => sessionStorage.setItem("ru_intro_seen", "1"));

test.describe("life section", () => {
  test.beforeEach(async ({ page }) => skipIntro(page));

  test("panels slide sideways on wide screens and stack on phones", async ({ page }) => {
    await page.goto("/");
    const life = page.locator("#life");
    const track = page.locator(".htrack");
    const top = await life.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const height = await life.evaluate((el) => (el as HTMLElement).offsetHeight);
    await page.evaluate((y) => window.scrollTo(0, y), top + height / 2);
    const x = () => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    if (isPhone(page)) {
      expect(await x()).toBe(0);
      expect(height).toBeLessThan(3000);
    } else {
      await expect.poll(x).toBeLessThan(-200);
    }
    await expect(page.getByRole("heading", { name: "Manchester United" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Race weekends" })).toBeAttached();
  });

  test("the nav reaches Life", async ({ page }) => {
    test.skip(isPhone(page), "desktop navigation");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Sections" }).first();
    await nav.getByRole("link", { name: "Life", exact: true }).click();
    await expect(nav.getByRole("link", { name: "Life", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });
});

test.describe("photo gallery", () => {
  test.beforeEach(async ({ page }) => skipIntro(page));

  test("grid, single photo, keyboard and closing", async ({ page }) => {
    await page.goto("/");
    const seeAll = page.getByRole("button", { name: "See all 15 photos" }).first();
    await seeAll.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await seeAll.click({ force: true });

    const dialog = page.getByRole("dialog", { name: "Instagram photos" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: /^Open photo/ })).toHaveCount(15);
    await expect(dialog.getByRole("button", { name: "Close gallery" })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

    await dialog.getByRole("button", { name: /^Open photo 6:/ }).click();
    await expect(dialog.getByRole("figure")).toContainText("A red panda in the trees");
    await expect(dialog.getByRole("figure")).toContainText("6 / 15");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("figure")).toContainText("7 / 15");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("figure")).toContainText("5 / 15");
    await dialog.getByRole("button", { name: "Next photo" }).click();
    await expect(dialog.getByRole("figure")).toContainText("6 / 15");

    await dialog.getByRole("button", { name: "All photos" }).click();
    await expect(dialog.getByRole("button", { name: /^Open photo/ })).toHaveCount(15);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(seeAll).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("a preview photo opens straight to that photo", async ({ page }) => {
    await page.goto("/");
    const first = page.getByRole("button", { name: /^Open photo 1:/ }).first();
    await first.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await first.click({ force: true });
    const dialog = page.getByRole("dialog", { name: "Instagram photos" });
    await expect(dialog.getByRole("figure")).toContainText("Two cats at dusk");
    await dialog.getByRole("button", { name: "Close gallery" }).click();
    await expect(dialog).toBeHidden();
  });

  test("photos carry no location data", async ({ request }) => {
    for (const file of [
      "01-two-cats-at-dusk.jpg",
      "08-evening-football.jpg",
      "15-sunset-on-the-jetty.jpg",
    ]) {
      const body = await (await request.get(`/images/life/${file}`)).body();
      // JPEG EXIF blocks start with "Exif\0\0"; the cleaned photos have none.
      expect(body.includes(Buffer.from("Exif\0\0"))).toBe(false);
    }
  });
});

test("smooth scrolling runs with a mouse, not on touch screens", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  if (isPhone(page)) await expect(page.locator("html")).not.toHaveClass(/lenis/);
  else await expect(page.locator("html")).toHaveClass(/lenis/);
});

test.describe("live data (test fixtures)", () => {
  test.beforeEach(async ({ page }) => skipIntro(page));

  test("song shows in the hero and the Life section", async ({ page }) => {
    await page.goto("/");
    const pill = page.locator(".herosong");
    await expect(pill).toContainText("NOW PLAYING ON SPOTIFY");
    await expect(pill).toContainText("Test Track");
    await expect(page.locator("#life").getByRole("link", { name: /Test Track/ })).toHaveAttribute(
      "href",
      "https://open.spotify.com/",
    );
  });

  test("the now-playing route answers and is cached briefly", async ({ request }) => {
    const res = await request.get("/api/now-playing");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("s-maxage=20");
    expect((await res.json()).status).toBe("playing");
  });

  test("the Spotify setup pages are closed without the app's keys", async ({ request }) => {
    const login = await request.get("/api/spotify/login", { maxRedirects: 0 });
    expect(login.status()).toBe(404);
    expect(await login.text()).toContain("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET aren't set");
    expect((await request.get("/api/spotify/callback?code=x&state=y")).status()).toBe(404);
  });

  test("United is highlighted in the table", async ({ page }) => {
    await page.goto("/");
    const row = page.locator("#life ol li").filter({ hasText: "Man United" });
    await expect(row.locator("span").first()).toHaveCSS("font-weight", "600");
  });
});
