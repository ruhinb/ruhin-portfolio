import { expect, test, type Page } from "@playwright/test";

async function skipIntros(page: Page, cases = true) {
  await page.addInitScript((cases) => {
    sessionStorage.setItem("ru_intro_seen", "1");
    if (cases)
      for (const s of ["patientcare", "discount", "slice"])
        sessionStorage.setItem(`ru_case_${s}`, "1");
  }, cases);
}

test.describe("projects section", () => {
  test.beforeEach(async ({ page }) => skipIntros(page));

  test("filters show the right projects", async ({ page }) => {
    await page.goto("/");
    const work = page.locator("#work");
    const cards = work.locator("article.stackcard");
    const rows = work.locator("ul li");
    await expect(cards).toHaveCount(3);
    await expect(rows).toHaveCount(5);

    await work.getByRole("button", { name: /^Machine learning/ }).click();
    await expect(work.getByRole("button", { name: /^Machine learning/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(cards).toHaveCount(0);
    await expect(rows).toHaveCount(4);
    await expect(work.getByRole("heading", { name: "PROJECTS", exact: true })).toBeVisible();

    await work.getByRole("button", { name: /^Capstone/ }).click();
    await expect(rows).toHaveCount(2);

    await work.getByRole("button", { name: /^Analytics/ }).click();
    await expect(cards).toHaveCount(3);
    await expect(rows).toHaveCount(0);
    await expect(work.getByText("That's everything in this category.")).toBeVisible();
  });

  test("report pages change with the arrows and the tabs", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("article.stackcard").first();
    await card.scrollIntoViewIfNeeded();
    const tabs = card.getByRole("tab");
    await expect(tabs).toHaveCount(5);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    await card.getByRole("button", { name: "Next report page" }).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(card.getByRole("tabpanel")).toContainText("Semi-urban patients missed 15.9%");

    await tabs.nth(1).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(2)).toBeFocused();
    await page.keyboard.press("End");
    await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");

    // Next on the last page wraps round to the first.
    await card.getByRole("button", { name: "Next report page" }).click();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  });

  test("case study links open the case study and come back", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("article.stackcard").nth(1);
    await card.scrollIntoViewIfNeeded();
    await card.getByRole("link", { name: "Read the case study" }).click();
    await expect(page).toHaveURL(/\/projects\/discount$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Discount Guardrails");

    await page.getByRole("link", { name: "All projects" }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeVisible();
    // The loader doesn't replay when coming back.
    await expect(page.locator(".loader")).toBeHidden();
  });
});

test.describe("case studies", () => {
  for (const [slug, title, next] of [
    ["patientcare", "PatientCare Analytics", "Discount Guardrails"],
    ["discount", "Discount Guardrails", "Slice & Co. Pizza Operations"],
    ["slice", "Slice & Co. Pizza Operations", "PatientCare Analytics"],
  ] as const) {
    test(`${slug} page renders and links to the next one`, async ({ page }) => {
      await skipIntros(page);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const res = await page.goto(`/projects/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(title.replace(/[.&]/g, "\\$&")));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.getByRole("heading", { name: /^FINDING/ })).toHaveCount(0); // labels, not headings
      await expect(page.locator("#findings article")).toHaveCount(3);
      const imgs = page.locator("main img");
      expect(await imgs.count()).toBe(4);
      await expect(
        page.getByRole("link", {
          name: new RegExp(`NEXT PROJECT\\s*${next.replace(/[.&]/g, "\\$&")}`),
        }),
      ).toHaveAttribute("href", /\/projects\//);
      expect(errors).toEqual([]);
    });
  }

  test("the what-if switch updates the number", async ({ page }) => {
    await skipIntros(page);
    await page.goto("/projects/patientcare");
    const box = page.locator(".decbox");
    await box.scrollIntoViewIfNeeded();
    await expect(box).toContainText("−5.9 pts");
    await box.getByRole("button", { name: "May 2023" }).click();
    await expect(box.getByRole("button", { name: "May 2023" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(box).toContainText("−8.2 pts");
    await box.getByRole("button", { name: "June 2023" }).click();
    await expect(box).toContainText("−2.8 pts");
  });

  test("the curtain plays once per case study per session", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("ru_intro_seen", "1"));
    await page.goto("/projects/slice");
    const curtain = page.locator(".curtain");
    await expect(curtain).toBeVisible();
    await expect(curtain).toContainText("Slice & Co.");
    // It lifts away and is remembered once its animation ends.
    await expect
      .poll(() => page.evaluate(() => sessionStorage.getItem("ru_case_slice")), { timeout: 5000 })
      .toBe("1");
    await page.reload();
    await expect(page.locator(".curtain")).toHaveCount(0);
    // A different case study still gets its curtain.
    await page.goto("/projects/discount");
    await expect(page.locator(".curtain")).toBeVisible();
  });

  test("unknown case studies are a 404", async ({ page }) => {
    const res = await page.goto("/projects/not-a-project");
    expect(res?.status()).toBe(404);
  });
});

test("stacked cards shrink as the next one arrives, with the GSAP fallback too", async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) < 900, "cards don't stack on small screens");
  for (const forceJs of [false, true]) {
    await skipIntros(page);
    if (forceJs)
      await page.addInitScript(() => {
        const add = () => document.documentElement?.classList.add("motion-js");
        if (document.documentElement) add();
        else document.addEventListener("readystatechange", add, { once: true });
      });
    await page.goto("/");
    const cards = page.locator("article.stackcard");
    const secondTop = await cards
      .nth(1)
      .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y - 150), secondTop);
    await expect
      .poll(() => cards.nth(0).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a))
      .toBeLessThan(0.97);
  }
});
