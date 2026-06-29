import { test, expect, Page } from '@playwright/test'

// Tests open the app with ?e2e=1. Combined with Playwright's
// navigator.webdriver===true this triggers the test-only auth bypass (lands on
// the canvas, no Google OAuth) AND exposes window.__e2e helpers that call the
// real app logic. Both are unreachable for real users (webdriver===false).
const APP = '?e2e=1'

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(String(e)))
  return errors
}

async function gotoApp(page: Page) {
  await page.goto(APP)
  await expect(page.getByTestId('canvas')).toBeVisible({ timeout: 15_000 })
  // Wait until the e2e hooks are installed.
  await page.waitForFunction(() => !!(window as any).__e2e, null, { timeout: 10_000 })
}

// Drive the real add-node logic (same function the UI calls) without fighting
// canvas overlay hit-testing.
async function addNode(page: Page, type?: string) {
  await page.evaluate((t) => (window as any).__e2e.addNode(t), type)
}
const nodeCount = (page: Page) => page.locator('[data-nodeid]').count()

test.describe('App health', () => {
  test('loads to the canvas with no console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await gotoApp(page)
    await page.waitForTimeout(500)
    expect(errors, 'console errors on load:\n' + errors.join('\n')).toEqual([])
  })

  test('history widget pill appears after an edit', async ({ page }) => {
    await gotoApp(page)
    await addNode(page)
    await expect(page.getByTestId('hist-undo')).toBeVisible()
    await expect(page.getByTestId('hist-redo')).toBeVisible()
    await expect(page.getByTestId('hist-clock')).toBeVisible()
  })
})

test.describe('Undo / Redo', () => {
  test('add → undo removes it → redo restores it', async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await gotoApp(page)
    expect(await nodeCount(page)).toBe(0)

    await addNode(page)
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)

    await page.getByTestId('hist-undo').click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(0)

    await page.getByTestId('hist-redo').click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('undo button becomes disabled back at baseline', async ({ page }) => {
    await gotoApp(page)
    await addNode(page)
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)
    await page.getByTestId('hist-undo').click()
    await expect(page.getByTestId('hist-undo')).toBeDisabled()
  })

  test('keyboard Ctrl+Z / Ctrl+Y work', async ({ page }) => {
    await gotoApp(page)
    await addNode(page)
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)
    await page.keyboard.press('Control+z')
    await expect(page.locator('[data-nodeid]')).toHaveCount(0)
    await page.keyboard.press('Control+y')
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)
  })
})

test.describe('History timeline', () => {
  test('opens, lists entries, and is clickable to jump', async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await gotoApp(page)

    await addNode(page)
    await addNode(page)
    await addNode(page)
    await expect(page.locator('[data-nodeid]')).toHaveCount(3)

    await page.getByTestId('hist-clock').click()
    await expect(page.getByTestId('hist-timeline')).toBeVisible()

    await expect(page.getByTestId('hist-row-now')).toHaveCount(1)
    const pastRows = page.locator('[data-testid="hist-row"][data-kind="past"]')
    expect(await pastRows.count()).toBe(3)

    // Click the OLDEST past row (last, since newest-first) → jump to baseline.
    await pastRows.last().click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(0)

    // Reopen; now there should be 3 future (redo) rows.
    await page.getByTestId('hist-clock').click()
    const futureRows = page.locator('[data-testid="hist-row"][data-kind="future"]')
    expect(await futureRows.count()).toBe(3)

    // Click the top future row (furthest redo) → back to all 3 nodes.
    await futureRows.first().click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(3)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('Bee semantics: new edit after jumping back discards the redo branch', async ({ page }) => {
    await gotoApp(page)
    await addNode(page)
    await addNode(page)
    await addNode(page)
    await expect(page.locator('[data-nodeid]')).toHaveCount(3)

    await page.getByTestId('hist-undo').click()
    await page.getByTestId('hist-undo').click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)
    await expect(page.getByTestId('hist-redo')).toBeEnabled()

    await addNode(page)
    await expect(page.locator('[data-nodeid]')).toHaveCount(2)
    await expect(page.getByTestId('hist-redo')).toBeDisabled()
  })
})
