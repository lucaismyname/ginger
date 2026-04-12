import { test, expect } from "@playwright/test";

test.describe("Ginger playback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the demo page with examples nav", async ({ page }) => {
    await expect(page.locator("nav[aria-label='Examples']")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Single track" })
    ).toBeVisible();
  });

  test("single track demo shows title and play button", async ({ page }) => {
    await page.getByRole("button", { name: "Single track" }).click();
    await expect(page.locator("text=Single track")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /play/i })
    ).toBeVisible();
  });

  test("playlist demo shows multiple tracks", async ({ page }) => {
    await page
      .getByRole("button", { name: "Playlist + controls" })
      .click();
    await expect(page.locator("text=Now playing")).toBeVisible();
  });

  test("navigating between demos works", async ({ page }) => {
    await page.getByRole("button", { name: "Single track" }).click();
    await expect(page.locator("text=Single track")).toBeVisible();

    await page.getByRole("button", { name: "CSS variables" }).click();
    await expect(
      page.locator("text=CSS variables on Provider")
    ).toBeVisible();

    await page.getByRole("button", { name: "Unstyled showcase" }).click();
    await expect(
      page.locator("text=Fully unstyled mode")
    ).toBeVisible();
  });

  test("play/pause button toggles state", async ({ page }) => {
    await page.getByRole("button", { name: "Single track" }).click();
    const playBtn = page.getByRole("button", { name: /play/i }).first();
    await expect(playBtn).toBeVisible();
    await playBtn.click();
    // After clicking play, button should change to pause
    await expect(
      page.getByRole("button", { name: /pause/i }).first()
    ).toBeVisible({ timeout: 5000 });
  });
});
