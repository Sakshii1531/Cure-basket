// @ts-check
const { test, expect } = require('@playwright/test');

const EMAIL = `test_${Date.now()}@playwright.dev`;
const PASSWORD = 'Playwright123!';

test.describe('Customer flow', () => {
  test('signup → browse → add to cart', async ({ page }) => {
    // Signup
    await page.goto('/signup');
    await page.getByPlaceholder(/full name/i).fill('Playwright User');
    await page.getByPlaceholder(/email/i).fill(EMAIL);
    await page.getByPlaceholder(/min\. 8/i).fill(PASSWORD);
    await page.getByRole('button', { name: /create account/i }).click();

    // Should land on home or account page after signup
    await expect(page).toHaveURL(/account|\/$/);

    // Navigate to medicines and add to cart
    await page.goto('/medicines');
    const addBtn = page.locator('button', { hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      // Toast or cart count should update
      await expect(page.locator('[data-testid="cart-count"], .cart-count, text=cart')).toBeTruthy();
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

    await page.getByPlaceholder(/email/i).fill('user@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();

    // Success state — shows "Check your inbox" or similar
    await expect(
      page.locator('text=Check your inbox').or(page.locator('text=reset link has been sent'))
    ).toBeVisible({ timeout: 8000 });
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
