import { expect, test } from "@playwright/test";

test("home page loads with the right title and name", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Rubaiyat Ruhin/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rubaiyat");
});

test("security headers are sent", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["content-security-policy"]).toContain("object-src 'none'");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("theme toggle switches between light and dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(html).toHaveClass(/dark/);

  // The choice survives a reload.
  await page.reload();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(html).not.toHaveClass(/dark/);
});

test("first visit follows the device's dark setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("fonts load from the site itself", async ({ page }) => {
  const fontHosts = new Set<string>();
  page.on("request", (req) => {
    if (req.resourceType() === "font") fontHosts.add(new URL(req.url()).host);
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const serifLoaded = await page.evaluate(() =>
    [...document.fonts].some((f) => f.family.includes("Instrument") && f.status === "loaded"),
  );
  expect(serifLoaded).toBe(true);
  for (const host of fontHosts) expect(host).toMatch(/^localhost(:\d+)?$/);
});

test("no errors in the browser console", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("unknown pages show the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nothing");
  await page.getByRole("link", { name: "Back to the home page" }).click();
  await expect(page).toHaveURL("/");
});

test("every internal link resolves", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("a[href^='/']")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")!));
  for (const href of new Set(hrefs)) {
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});
