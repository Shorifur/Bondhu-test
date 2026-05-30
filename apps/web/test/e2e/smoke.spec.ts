import { test, expect } from '@playwright/test';

/**
 * Bondhu Frontend E2E Smoke Tests
 * Run with: npx playwright test
 */

test.describe('Bondhu Smoke Tests', () => {
  test('Onboarding flow loads', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');
    await expect(page.locator('text=Bondhu')).toBeVisible();
    await expect(page.locator('text=বন্ধু')).toBeVisible();
    await expect(page.locator('text=Continue with Mobile Number')).toBeVisible();
  });

  test('Language selector switches languages', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');
    await page.click('text=English');
    await expect(page.locator('text=Connected Always')).toBeVisible();
    await page.click('text=বাংলা');
    await expect(page.locator('text=বন্ধনে অবিরত')).toBeVisible();
  });

  test('Phone input validates Bangladeshi numbers', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding/phone');
    await page.fill('input[type="tel"]', '123456');
    await page.click('text=Send Verification Code');
    await expect(page.locator('text=valid Bangladeshi mobile number')).toBeVisible();
  });

  test('Main layout redirects unauthenticated users', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForURL('**/onboarding**', { timeout: 5000 });
  });
});
