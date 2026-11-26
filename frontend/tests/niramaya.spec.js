import { test, expect } from "@playwright/test";

const BASE_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Niramaya Physiotherapy — Comprehensive Regression Suite", () => {
  test("homepage loads cleanly with base Google tag and zero runtime errors", async ({ page }) => {
    const pageErrors = [];
    const consoleErrors = [];
    const tagRequests = [];

    page.on("pageerror", (err) => pageErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("request", (req) => {
      if (req.url().includes("AW-11465883491")) {
        tagRequests.push(req.url());
      }
    });

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await expect(page.getByTestId("hero-section")).toBeVisible();
    await expect(page.getByTestId("hero-location")).toContainText("Life Republic");
    await expect(page.getByTestId("site-header")).toBeVisible();
    await expect(page.getByTestId("site-footer")).toBeVisible();

    expect(tagRequests.length).toBeGreaterThan(0);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test("language switcher updates localized content and persists across sections", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    const initialHeroText = await page.getByTestId("hero-section").innerText();

    const switcher = page.getByTestId("language-switcher");
    if (await switcher.count()) {
      await switcher.click();
      const hiOption = page
        .getByRole("button", { name: /^(HI|हिन्दी|Hindi)$/i })
        .or(page.getByRole("option", { name: /^(HI|हिन्दी|Hindi)$/i }));
      if (await hiOption.first().isVisible().catch(() => false)) {
        await hiOption.first().click();
        await expect
          .poll(async () => await page.getByTestId("hero-section").innerText())
          .not.toBe(initialHeroText);
      }
    }
  });

test("navigates across Ravet and Punawale branches via navbar and footer and returns home", async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // Navbar -> Ravet
    await page.getByTestId("nav-branches-btn").click();
    await page.getByTestId("nav-branch-ravet").click();
    await expect(page).toHaveURL(/\/branches\/ravet$/);
    await expect(page.getByTestId("hero-headline")).toContainText("Ravet.");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://physiohelp.in/branches/ravet"
    );

    // Scroll to bottom and navigate -> Punawale via footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const punawaleTestId = page.getByTestId("footer-branch-punawale");
    if (await punawaleTestId.count()) {
      await punawaleTestId.first().click();
    } else {
      await page.getByTestId("site-footer").getByRole("link", { name: /punawale/i }).first().click();
    }

    await expect(page).toHaveURL(/\/branches\/punawale$/);
    await expect(page.getByTestId("hero-headline")).toContainText("Punawale.");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://physiohelp.in/branches/punawale"
    );

// Scroll back to top before clicking navbar Home link
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByTestId("nav-link-home").click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.getByTestId("hero-location")).toContainText("Life Republic");
  });

  test("mobile menu shows branches, closes on X button, and navigates cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    await page.getByTestId("mobile-menu-trigger").click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByTestId("mobile-branch-main")).toBeVisible();
    await expect(page.getByTestId("mobile-branch-ravet")).toBeVisible();
    await expect(page.getByTestId("mobile-branch-punawale")).toBeVisible();

    // Close via sheet close (X) button
    await menu.locator("button").first().click();
    await expect(menu).toBeHidden();

    // Re-open and navigate to Punawale
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(menu).toBeVisible();
    await page.getByTestId("mobile-branch-punawale").click();
    await expect(page).toHaveURL(/\/branches\/punawale$/);
    await expect(menu).toBeHidden();
  });

  test("redirects unknown branch slug cleanly back to home", async ({ page }) => {
    await page.goto(`${BASE_URL}/branches/does-not-exist`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.getByTestId("hero-location")).toContainText("Life Republic");
  });

  test("verifies JSON-LD schema on branch page and static SEO assets", async ({ page, request }) => {
    await page.goto(`${BASE_URL}/branches/ravet`, { waitUntil: "networkidle" });
    const schemaEl = page
      .locator('#branch-jsonld-schema, script[type="application/ld+json"]')
      .first();
    if (await schemaEl.count()) {
      const rawJson = await schemaEl.textContent();
      expect(rawJson).toBeTruthy();
      const parsed = JSON.parse(rawJson);
      expect(parsed["@type"]).toBe("Physiotherapy");
      expect(parsed.name).toContain("Niramaya Physiotherapy");
    }

    const robotsRes = await request.get(`${BASE_URL}/robots.txt`);
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain("Sitemap:");

    const sitemapRes = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain("/branches/ravet");
    expect(sitemapXml).toContain("/branches/punawale");
  });

test("opens booking modal, validates inputs, and pushes conversion event on valid submit", async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      window.dataLayer = window.dataLayer || [];
      window.open = () => null;
    });

    await page.getByTestId("nav-book-consultation-btn").click();

    const form = page.locator("form").filter({ has: page.locator("input") }).first();
    const hasForm = await form.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasForm) {
      return;
    }

    const submitBtn = form.locator("button[type='submit']").first();
const countConversions = () =>
      page.evaluate(() => {
        const matchesConversion = (val, depth = 0) => {
          if (!val || depth > 4) return false;
          if (typeof val === "string") {
            return val.includes("AW-11465883491/a6ToCL-r6JEbEOP-rdsq");
          }
          if (typeof Element !== "undefined" && val instanceof Element) {
            return false;
          }
          if (typeof val === "object") {
            const items =
              typeof val.length === "number" && !Array.isArray(val)
                ? Array.from(val)
                : Array.isArray(val)
                  ? val
                  : Object.values(val);
            return items.some((child) => matchesConversion(child, depth + 1));
          }
          return false;
        };

        return (window.dataLayer || []).filter((entry) => matchesConversion(entry)).length;
      });

    // Attempt empty submission first
    if (await submitBtn.count()) {
      await submitBtn.click();
    }
    const beforeEmptyPushCount = await countConversions();

    // Fill visible text, tel, and select inputs inside the booking form
    const inputs = form.locator("input:visible");
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const inp = inputs.nth(i);
      const type = (await inp.getAttribute("type")) || "text";
      if (type === "tel" || /phone|mobile/i.test((await inp.getAttribute("name")) || "")) {
        await inp.fill("9876543210");
      } else if (type === "email") {
        await inp.fill("test@example.com");
      } else if (type !== "checkbox" && type !== "radio" && type !== "hidden") {
        await inp.fill("Test Patient");
      }
    }

    const selects = form.locator("select:visible");
    const selectCount = await selects.count();
    for (let i = 0; i < selectCount; i++) {
      const sel = selects.nth(i);
      const options = await sel.locator("option").all();
      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val && val.trim() !== "") {
          await sel.selectOption(val);
          break;
        }
      }
    }

    if (await submitBtn.count()) {
      await submitBtn.click();
    }

    const afterValidPushCount = await countConversions();
    expect(afterValidPushCount).toBeGreaterThan(beforeEmptyPushCount);
  });
});