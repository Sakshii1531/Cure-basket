// @ts-check
import { test, expect } from '@playwright/test';

// Use real admin credentials from env or fallback to dev defaults
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'superadmin@example.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'change_this_strong_password';

test.describe('Admin flow', () => {
  test('non-admin cannot access /admin', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login
    await expect(page).toHaveURL(/admin\/login/);
  });

  test('admin login page renders correctly', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: /admin portal/i })).toBeVisible();
    await expect(page.getByPlaceholder(/admin@curebasket/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /forgot/i })).toBeVisible();
  });

  test('admin login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByPlaceholder(/admin@curebasket/i).fill('bad@test.com');
    await page.getByPlaceholder(/••/i).fill('wrongpassword');
    await page.getByRole('button', { name: /login as admin/i }).click();

    await expect(
      page.locator('[class*="red"]').or(page.locator('text=Invalid credentials').or(page.locator('text=Login failed')))
    ).toBeVisible({ timeout: 8000 });
  });

  test('admin login and reach dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByPlaceholder(/admin@curebasket/i).fill(ADMIN_EMAIL);
    await page.getByPlaceholder(/••/i).fill(ADMIN_PASS);
    await page.getByRole('button', { name: /login as admin/i }).click();

    // Should land on admin dashboard
    await expect(page).toHaveURL(/\/admin($|\/)/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('admin medicines page loads', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.getByPlaceholder(/admin@curebasket/i).fill(ADMIN_EMAIL);
    await page.getByPlaceholder(/••/i).fill(ADMIN_PASS);
    await page.getByRole('button', { name: /login as admin/i }).click();
    // Wait for the dashboard to actually render (confirms auth finished) before
    // navigating — the URL alone matches /admin/login too, racing the redirect.
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });

    // Navigate to medicines
    await page.goto('/admin/medicines');
    await expect(page.getByRole('heading', { name: /medicines management/i })).toBeVisible({ timeout: 10000 });
  });
});
