import { test, expect, Page } from '@playwright/test'

// All tests open the app with ?e2e=1. Combined with Playwright's
// navigator.webdriver===true, this triggers the test-only auth bypass so we
// land on the canvas without a real Google login. The bypass is unreachable
// for real users (they have webdriver===false).
// Relative (no leading slash) so it resolves against Playwright's baseURL,
// which already includes the /customer-journey-mapper/ base path. A leading
// slash would discard the base and load the wrong URL.
const APP = '?e2e=1'

// Collect console errors so every test can assert the app didn't throw.
function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(String(e)))
  return errors
}

async function gotoApp(page: Page) {
  const consoleMsgs: string[] = []
  page.on('console', m => consoleMsgs.push(`[${m.type()}] ${m.text()}`))
  page.on('pageerror', e => consoleMsgs.push(`[pageerror] ${String(e)}`))
  await page.goto(APP)
  // The canvas only renders once auth resolves; wait for it.
  try {
    await expect(page.getByTestId('canvas')).toBeVisible({ timeout: 15_000 })
  } catch (e) {
    // Diagnostics: dump what actually rendered so CI failure output is useful.
    const url = page.url()
    const webdriver = await page.evaluate(() => (navigator as any).webdriver)
    const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 600)
    const hasLogin = await page.getByText(/sign in with google/i).count().catch(() => 0)
    const rootHtml = (await page.locator('#root').innerHTML().catch(() => '')).slice(0, 400)
    throw new Error(
      `Canvas not found.\n  url=${url}\n  navigator.webdriver=${webdriver}\n  hasGoogleLoginButton=${hasLogin}\n` +
      `  bodyText="${bodyText}"\n  rootHtml="${rootHtml}"\n  console:\n  ${consoleMsgs.slice(0, 20).join('\n  ')}`
    )
  }
}

// Add a node via the Map It modal (stable, independent of sidebar collapse).
async function addNode(page: Page) {
  // The canvas (.cvbg) is a full-area sibling that can intercept pointer
  // hit-testing on the toolbar button, so force the click. The button is
  // already visible+enabled (Playwright confirms this before forcing).
  await page.getByTestId('open-mapit').click({ force: true })
  const tile = page.getByTestId('mapit-tile').first()
  await expect(tile).toBeVisible({ timeout: 10_000 })
  await tile.click()
  // Modal closes and a node appears; let state settle.
  await page.waitForTimeout(300)
}

const nodeCount = (page: Page) => page.locator('[data-nodeid]').count()

test.describe('App health', () => {
  test('loads to the canvas with no console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await gotoApp(page)
    // Give any async boot work a beat to surface errors.
    await page.waitForTimeout(500)
    expect(errors, 'console errors on load:\n' + errors.join('\n')).toEqual([])
  })

  test('history widget pill is visible after an edit', async ({ page }) => {
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
    expect(await nodeCount(page)).toBe(1)

    await page.getByTestId('hist-undo').click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(0)

    await page.getByTestId('hist-redo').click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('undo button disabled when nothing to undo', async ({ page }) => {
    await gotoApp(page)
    await addNode(page)
    // After one undo we are back at baseline → undo disabled.
    await page.getByTestId('hist-undo').click()
    await expect(page.getByTestId('hist-undo')).toBeDisabled()
  })

  test('keyboard Ctrl+Z / Ctrl+Y work', async ({ page }) => {
    await gotoApp(page)
    await addNode(page)
    expect(await nodeCount(page)).toBe(1)
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

    // Make 3 edits → 3 nodes.
    await addNode(page)
    await addNode(page)
    await addNode(page)
    expect(await nodeCount(page)).toBe(3)

    // Open the timeline.
    await page.getByTestId('hist-clock').click()
    await expect(page.getByTestId('hist-timeline')).toBeVisible()

    // There should be a "Now" row plus 3 past rows.
    await expect(page.getByTestId('hist-row-now')).toHaveCount(1)
    const pastRows = page.locator('[data-testid="hist-row"][data-kind="past"]')
    expect(await pastRows.count()).toBe(3)

    // Click the OLDEST past row (largest negative delta) → jump to baseline (0 nodes).
    // Rows are newest-first, so the last past row is the oldest.
    await pastRows.last().click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(0)

    // Reopen timeline; now there should be future (redo) rows.
    await page.getByTestId('hist-clock').click()
    const futureRows = page.locator('[data-testid="hist-row"][data-kind="future"]')
    expect(await futureRows.count()).toBe(3)

    // Click the top future row (furthest redo) → jump back to all 3 nodes.
    await futureRows.first().click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(3)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('Bee semantics: new edit after jumping back discards the redo branch', async ({ page }) => {
    await gotoApp(page)
    await addNode(page) // 1
    await addNode(page) // 2
    await addNode(page) // 3
    expect(await nodeCount(page)).toBe(3)

    // Undo twice → 1 node, with a redo branch of 2.
    await page.getByTestId('hist-undo').click()
    await page.getByTestId('hist-undo').click()
    await expect(page.locator('[data-nodeid]')).toHaveCount(1)
    await expect(page.getByTestId('hist-redo')).toBeEnabled()

    // New edit → redo branch should vanish.
    await addNode(page) // now 2 nodes
    await expect(page.locator('[data-nodeid]')).toHaveCount(2)
    await expect(page.getByTestId('hist-redo')).toBeDisabled()
  })
})
