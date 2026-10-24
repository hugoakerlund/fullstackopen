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
      await loginWith(page, 'test', 'password')
      await expect(page.getByText('blogs')).toBeVisible()
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
      await createBlog(page, 'new blog title', 'new blog author', 'new blog url')
      await expect(page.getByText('new blog title')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'new blog title', 'new blog author', 'new blog url')
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

    describe('When there are multiple blogs that have likes', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'title1', 'author1', 'url1')
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()

        await createBlog(page, 'title2', 'author2', 'url2')
        await page.getByRole('button', { name: 'view' }).click()
        let likeButtons = await page.getByRole('button', { name: 'like' }).all()
        for (let i = 0; i < 2; ++i) {
          await likeButtons[1].click()
        }
        await expect(page.getByText('likes 2')).toBeVisible()

        await createBlog(page, 'title3', 'author3', 'url3')
        await page.getByRole('button', { name: 'view' }).click()
        likeButtons = await page.getByRole('button', { name: 'like' }).all()
        for (let i = 0; i < 3; ++i) {
          await likeButtons[2].click()
        }
        await expect(page.getByText('likes 3')).toBeVisible()
      })

      test('The blogs are arranged in the order according to the likes', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        let removeButtons = await page.getByRole('button', { name: 'remove' }).all()

        await page.getByText('likes 3').waitFor()
        await removeButtons[0].click()
        await expect(page.getByText('likes 3')).not.toBeVisible()

        await page.getByText('likes 2').waitFor()
        removeButtons = await page.getByRole('button', { name: 'remove' }).all()
        await removeButtons[0].click()
        await expect(page.getByText('likes 2')).not.toBeVisible()

        await page.getByText('likes 1').waitFor()
        removeButtons = await page.getByRole('button', { name: 'remove' }).all()
        await removeButtons[0].click()
        await expect(page.getByText('likes 1')).not.toBeVisible()
      })
    })
  })

  describe('When there is a blog created by another user', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password')
      await createBlog(page, 'new blog title', 'new blog author', 'new blog url')
    })

    test('only the user who created the blog can see the remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'test2', 'password')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).not.toBeVisible()
    })
  })
})
