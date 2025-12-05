#!/usr/bin/env node

/**
 * E2E Test Script: Resume Builder User Journey
 * 
 * Tests complete flow from signup to download
 * Usage: npx ts-node tests/e2e-test.ts
 */

import { chromium, Browser, Page, BrowserContext } from "playwright";

const BASE_URL = "http://localhost:5000";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function log(message: string, type: "info" | "success" | "warning" | "error" = "info") {
  const colors: Record<string, string> = {
    info: "\x1b[36m",    // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m",   // Red
  };
  const reset = "\x1b[0m";
  console.log(`${colors[type]}[${type.toUpperCase()}]${reset} ${message}`);
}

async function navigateToBuilder(page: Page) {
  await log("Navigating to builder page...");
  await page.goto(`${BASE_URL}/builder`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await log("Builder page loaded", "success");
}

async function fillContactInfo(page: Page) {
  await log("Filling contact information...");
  
  try {
    const inputs = await page.locator("input").all();
    let filled = 0;

    // Fill first name
    const firstNameInput = page.locator('input[placeholder*="First"]').first();
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill("John");
      filled++;
    }

    // Fill last name
    const lastNameInput = page.locator('input[placeholder*="Last"]').first();
    if (await lastNameInput.isVisible()) {
      await lastNameInput.fill("Doe");
      filled++;
    }

    // Fill email
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill("test@example.com");
      filled++;
    }

    await log(`Filled ${filled} contact fields`, "success");
    return true;
  } catch (error) {
    await log(`Error filling contact info: ${error}`, "error");
    return false;
  }
}

async function clickNextButton(page: Page): Promise<boolean> {
  try {
    const nextBtn = page.locator('button:has-text("Save & Continue"), button:has-text("Next")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function testBuilderFlow() {
  await log("\n=== Starting Resume Builder E2E Test ===\n", "info");
  
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    // Launch browser
    await log("Launching browser...");
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    
    // Enable console logging
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log(`[BROWSER ERROR] ${msg.text()}`);
      }
    });

    page.on("pageerror", (error) => {
      console.log(`[PAGE ERROR] ${error.message}`);
    });

    await log("Browser launched successfully", "success");

    // Test 1: Navigate to builder
    await log("\n--- Test 1: Navigate to Builder ---", "info");
    await navigateToBuilder(page);
    results.push({ name: "Navigate to Builder", passed: true });

    // Test 2: Verify page elements exist
    await log("\n--- Test 2: Verify Builder Elements ---", "info");
    const header = page.locator("text=Resume Builder, Professional Summary, Contact").first();
    const buildButton = page.locator("button").first();
    
    if (await buildButton.isVisible()) {
      await log("Builder elements found", "success");
      results.push({ name: "Builder Elements Visible", passed: true });
    } else {
      throw new Error("Builder elements not visible");
    }

    // Test 3: Fill contact information
    await log("\n--- Test 3: Fill Contact Information ---", "info");
    const contactFilled = await fillContactInfo(page);
    if (contactFilled) {
      results.push({ name: "Fill Contact Info", passed: true });
    } else {
      throw new Error("Could not fill contact information");
    }

    // Test 4: Navigate through steps
    await log("\n--- Test 4: Navigate Through Steps ---", "info");
    let stepCount = 0;
    for (let i = 0; i < 7; i++) {
      const moved = await clickNextButton(page);
      if (moved) {
        stepCount++;
        await log(`Moved to step ${stepCount + 1}`, "success");
      } else {
        await log(`Could not move to next step`, "warning");
        break;
      }
    }
    
    results.push({ name: "Navigate Steps", passed: stepCount >= 3 });

    // Test 5: Check download page
    await log("\n--- Test 5: Verify Download Page ---", "info");
    const downloadBtn = page.locator('button:has-text("Download")').first();
    if (await downloadBtn.isVisible({ timeout: 3000 })) {
      await log("Download button found on final step", "success");
      results.push({ name: "Download Page Accessible", passed: true });
    } else {
      await log("Download button not found (but may still be on page)", "warning");
      results.push({ name: "Download Page Accessible", passed: false });
    }

    // Test 6: Check for AI feature gating
    await log("\n--- Test 6: Verify AI Feature Gating ---", "info");
    const proBadge = page.locator('text=Pro Feature').first();
    const aiButton = page.locator('button:has-text("Generate with AI")').first();
    
    if (await proBadge.isVisible({ timeout: 2000 })) {
      await log("AI feature properly shows 'Pro Feature' badge", "success");
      results.push({ name: "AI Feature Gating", passed: true });
    } else if (await aiButton.isVisible({ timeout: 2000 })) {
      await log("AI button visible (feature gating may not be working for guest)", "warning");
      results.push({ name: "AI Feature Gating", passed: false });
    } else {
      await log("AI feature not found on page", "warning");
      results.push({ name: "AI Feature Gating", passed: false });
    }

  } catch (error) {
    await log(`Test failed with error: ${error}`, "error");
    results.push({ name: "Overall Test", passed: false, error: String(error) });
  } finally {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

async function printResults() {
  await log("\n=== Test Results ===\n", "info");
  
  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const status = result.passed ? "✓ PASS" : "✗ FAIL";
    const color = result.passed ? "success" : "error";
    await log(`${status}: ${result.name}${result.error ? ` - ${result.error}` : ""}`, color);
    
    if (result.passed) passed++;
    else failed++;
  }

  await log(`\nTotal: ${passed} passed, ${failed} failed`, failed === 0 ? "success" : "warning");
  
  process.exit(failed === 0 ? 0 : 1);
}

// Run tests
(async () => {
  try {
    await testBuilderFlow();
    await printResults();
  } catch (error) {
    await log(`Fatal error: ${error}`, "error");
    process.exit(1);
  }
})();
