const bcrypt = require('bcrypt')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('are all returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 4)
  })
})

describe('blog', () => {
  test('is added to database', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const userId = await helper.getExistingUserId()

    const newBlog = {
      title: '123',
      author: '123',
      url: '123',
      likes: 1,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const title = response.body.map(r => r.title)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtBeginning.length, blogsAtEnd.length - 1)
    assert(title.includes('123'))
  })

  test('is removed from the database', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const blogToDelete = blogsAtBeginning[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('blog post information', () => {
  test('title is updated', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    let blogToChange = blogsAtBeginning[0]
    blogToChange.title = 'Changed'
    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const changedBlog = blogsAtEnd[0];
    assert.strictEqual(changedBlog.title, 'Changed')
  })

  test('author is updated', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    let blogToChange = blogsAtBeginning[0]
    blogToChange.author = 'changed author'
    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const changedBlog = blogsAtEnd[0];
    assert.strictEqual(changedBlog.author, 'changed author')
  })

  test('url is updated', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    let blogToChange = blogsAtBeginning[0]
    blogToChange.url = 'changed url'
    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const changedBlog = blogsAtEnd[0];
    assert.strictEqual(changedBlog.url, 'changed url')
  })

  test('likes are updated', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    let blogToChange = blogsAtBeginning[0]
    blogToChange.likes = 10000000000000000
    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const changedBlog = blogsAtEnd[0];
    assert.strictEqual(changedBlog.likes, 10000000000000000)
  })
})


describe('blog property', () => {
  test('unique identifier is named id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach((blog) => {
      assert(blog.hasOwnProperty('id') === true)
      assert(blog.hasOwnProperty('_id') === false)
    })
  })

  test('likes default to 0', async () => {
    const userId = await helper.getExistingUserId()

    const noLikesBlog = {
      title: '123',
      author: '123',
      url: '123',
      userId: userId
    }

    const result = await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(result._body.title, '123')
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
  })

  test('title must be set', async () => {
    const userId = await helper.getExistingUserId()

    const noTitleBlog = {
      author: '123',
      url: '123',
      likes: 0,
      userId: userId
    }

    const result = await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('title missing'))
  })

  test('url must be set', async () => {
    const userId = await helper.getExistingUserId()

    const noUrlBlog = {
      title: '123',
      author: '123',
      likes: 0,
      userId: userId
    }

    const result = await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('url missing'))
  })
})



after(async () => {
  await mongoose.connection.close()
})
