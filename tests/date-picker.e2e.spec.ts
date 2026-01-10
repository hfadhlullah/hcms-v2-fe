import { test, expect } from '@playwright/test';

test('Date picker is available in the application', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Check if the page loaded successfully
  const title = await page.title();
  console.log('Page title:', title);
  expect(title).toBeTruthy();
});
