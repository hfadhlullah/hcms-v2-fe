/**
 * E2E tests for login flow using Playwright
 * Tests: successful login, form validation, error handling
 * 
 * Usage: npx playwright test
 * Requires: backend running on localhost:8080, frontend on localhost:3000
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const API_URL = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:8080';

test.describe('Login Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Clear all storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login form', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Verify form elements are present
    await expect(page.locator('h1', { hasText: 'HCMS' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Email Address' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Password' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Login' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Forgot password?' })).toBeVisible();
  });

  test('should validate empty email on submit', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Leave email empty and click submit
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify validation error
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should validate invalid email format', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Enter invalid email
    await page.fill('input[id="email"]', 'notanemail');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate empty password on submit', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Enter email but leave password empty
    await page.fill('input[id="email"]', 'alice@company.com');
    await page.click('button[type="submit"]');

    // Verify validation error
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error on invalid credentials', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Enter invalid credentials
    await page.fill('input[id="email"]', 'alice@company.com');
    await page.fill('input[id="password"]', 'wrongpassword');

    // Mock API response for invalid credentials
    await page.route(`${API_URL}/api/v1/auth/login`, route => {
      route.abort('failed');
    });

    // Click submit
    await page.click('button[type="submit"]');

    // Verify error is displayed
    await expect(page.locator('.error-alert')).toBeVisible();
  });

  test('should show loading state during login', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Enter valid test credentials
    await page.fill('input[id="email"]', 'alice@company.com');
    await page.fill('input[id="password"]', 'password123');

    // Mock slow API response
    await page.route(`${API_URL}/api/v1/auth/login`, route => {
      setTimeout(() => route.continue(), 500);
    });

    // Click submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify button shows loading text
    await expect(submitButton).toContainText('Logging in...');
    await expect(submitButton).toBeDisabled();
  });

  test('should remember me checkbox', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Check remember me
    const rememberCheckbox = page.locator('input[id="remember-me"]');
    await expect(rememberCheckbox).not.toBeChecked();
    await rememberCheckbox.click();
    await expect(rememberCheckbox).toBeChecked();
  });

  test('should clear password on auth error', async () => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Enter credentials
    const passwordField = page.locator('input[id="password"]');
    await page.fill('input[id="email"]', 'alice@company.com');
    await page.fill('input[id="password"]', 'wrongpassword');

    // Mock API failure
    await page.route(`${API_URL}/api/v1/auth/login`, route => {
      route.abort('failed');
    });

    // Click submit
    await page.click('button[type="submit"]');

    // Wait for error, then verify password is cleared
    await expect(page.locator('.error-alert')).toBeVisible();
    await expect(passwordField).toHaveValue('');
  });

  test.skip('should successfully login with valid credentials', async () => {
    // This test requires a seeded test user in the database
    // Skip for now, enable after database seeding is set up

    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Enter valid test credentials (assumes test user exists)
    await page.fill('input[id="email"]', 'alice@company.com');
    await page.fill('input[id="password"]', 'password123');

    // Click submit
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);

    // Verify we're on dashboard
    await expect(page.locator('h1', { hasText: 'Welcome to HCMS Dashboard' })).toBeVisible();

    // Verify token is stored
    const token = await page.evaluate(() => localStorage.getItem('hcms_auth_token'));
    expect(token).toBeTruthy();
  });
});
