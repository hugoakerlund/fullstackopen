const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'password')
      await expect(page.getByText('log in to application')).not.toBeVisible()
      await expect(page.getByText('login')).not.toBeVisible()
      await expect(page.getByText('new blog')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrong username', 'wrong password')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })


  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'url')
      await expect(page.getByText('a new blog title by author added')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'title', 'author', 'url')
      })

      test('a new blog can be liked', async ({ page }) => {
        await page.getByTestId('blog-link').click();
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a new blog can be removed', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        await page.getByTestId('blog-link').click();
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('blog title by author deleted')).toBeVisible()
      })
    })
  })
})
