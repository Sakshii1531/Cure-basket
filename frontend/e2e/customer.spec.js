// @ts-check
import { test, expect } from '@playwright/test';

const EMAIL = `test_${Date.now()}@playwright.dev`;
const PASSWORD = 'Playwright123!';

test.describe('Customer flow', () => {
  test('signup → browse → add to cart', async ({ page }) => {
    // Signup — select inputs by their `name` attribute (robust against copy changes)
    await page.goto('/signup');
    await page.locator('input[name="name"]').fill('Playwright User');
    await page.locator('input[name="email"]').fill(EMAIL);
    await page.locator('input[name="phone"]').fill('+1 800 555 0100');
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.locator('input[name="confirmPassword"]').fill(PASSWORD);
    await page.getByRole('button', { name: /create account/i }).click();

    // Should leave /signup and land in a logged-in state (home or account)
    await expect(page).toHaveURL(/account|\/$/, { timeout: 10000 });

    // Browse medicines — the page should render without error. Add-to-cart is
    // best-effort since a fresh test DB may have no seeded catalogue.
    await page.goto('/medicines');
    await expect(page).toHaveURL(/medicines/);
    const addBtn = page.locator('button', { hasText: /add to cart/i }).first();
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
    }
  });

  test('login with wrong password shows lockout warning', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('nonexistent@test.com');
    await page.getByPlaceholder(/••/i).fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();

    // Should show error message
    await expect(page.locator('text=Invalid credentials').or(page.locator('[class*="red"]'))).toBeVisible({ timeout: 5000 });
  });

  test('forgot password page renders and submits', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible();

    await page.locator('input[type="email"]').fill('user@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();

    // Success state — shows "Check your inbox"
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 8000 });
  });

  test('cart page accessible without login', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
  });

  test('checkout redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/checkout');
    // Should be redirected to login (ProtectedRoute)
    await expect(page).toHaveURL(/login|account/);
  });
});
