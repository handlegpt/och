import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Och AI')).toBeVisible()
  })

  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL('/profile')
    await expect(page.locator('text=app.profile.tabs.dashboard')).toBeVisible()
  })

  test('should navigate to social page', async ({ page }) => {
    await page.goto('/social')
    await expect(page).toHaveURL('/social')
    await expect(page.locator('text=社交功能')).toBeVisible()
  })

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveURL('/pricing')
    await expect(page.locator('text=定价方案')).toBeVisible()
  })

  test('should navigate between pages using bottom navigation', async ({ page }) => {
    await page.goto('/')

    // 点击底部导航
    await page.click('[data-testid="nav-profile"]')
    await expect(page).toHaveURL('/profile')

    await page.click('[data-testid="nav-home"]')
    await expect(page).toHaveURL('/')
  })

  test('should handle back button navigation', async ({ page }) => {
    await page.goto('/')
    await page.goto('/profile')

    // 使用浏览器后退按钮
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('should maintain state during navigation', async ({ page }) => {
    await page.goto('/')

    // 设置一些状态（比如主题）
    await page.evaluate(() => {
      localStorage.setItem(
        'och-ai-store',
        JSON.stringify({
          state: {
            theme: { mode: 'light' },
          },
        })
      )
    })

    await page.goto('/profile')

    // 检查状态是否保持
    const theme = await page.evaluate(() => {
      const store = localStorage.getItem('och-ai-store')
      return store ? JSON.parse(store).state.theme.mode : null
    })

    expect(theme).toBe('light')
  })
})
