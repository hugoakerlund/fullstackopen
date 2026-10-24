const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test',
        username: 'test',
        password: 'password'
      }
    })
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test2',
        username: 'test2',
        password: 'password'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const header = page.getByText('log in to application')
    await expect(header).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByText('login')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('test')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('wrong username')
      await page.getByRole('textbox').last().fill('wrong password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('test')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill("new blog title")
      await textboxes[1].fill("new blog author")
      await textboxes[2].fill("new blog url")
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('new blog title')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill("new blog title")
        await textboxes[1].fill("new blog author")
        await textboxes[2].fill("new blog url")
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('a new blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('blog new blog title by new blog author deleted')).toBeVisible()
      })
    })
  })

  describe('When there is a blog created by another user', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('test')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill("new blog title")
      await textboxes[1].fill("new blog author")
      await textboxes[2].fill("new blog url")
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('only the user who created the blog can see the remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('textbox').first().fill('test2')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).not.toBeVisible()
    })
  })
})
