import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login modal when clicking login button', async ({ page }) => {
    await page.goto('/')

    // 点击登录按钮
    await page.click('[data-testid="login-button"]')

    // 检查模态框是否显示
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible()
    await expect(page.locator('text=登录 Och AI')).toBeVisible()
  })

  test('should show Google login option', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 检查 Google 登录按钮
    await expect(page.locator('text=使用 Google 登录')).toBeVisible()
  })

  test('should show Magic Link login option', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 检查 Magic Link 选项
    await expect(page.locator('text=Magic Link 登录')).toBeVisible()
    await expect(page.locator('input[placeholder="your@email.com"]')).toBeVisible()
  })

  test('should validate email input for Magic Link', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 输入无效邮箱
    await page.fill('input[placeholder="your@email.com"]', 'invalid-email')
    await page.click('text=发送 Magic Link')

    // 检查验证错误
    await expect(page.locator('text=请输入有效的邮箱地址')).toBeVisible()
  })

  test('should accept valid email for Magic Link', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 输入有效邮箱
    await page.fill('input[placeholder="your@email.com"]', 'test@example.com')
    await page.click('text=发送 Magic Link')

    // 检查成功消息
    await expect(page.locator('text=Magic Link 已发送')).toBeVisible()
  })

  test('should close modal when clicking close button', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 点击关闭按钮
    await page.click('[data-testid="close-modal"]')

    // 检查模态框是否关闭
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible()
  })

  test('should close modal when clicking overlay', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 点击遮罩层
    await page.click('[data-testid="modal-overlay"]')

    // 检查模态框是否关闭
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible()
  })

  test('should close modal with ESC key', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // 按 ESC 键
    await page.keyboard.press('Escape')

    // 检查模态框是否关闭
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible()
  })
})
