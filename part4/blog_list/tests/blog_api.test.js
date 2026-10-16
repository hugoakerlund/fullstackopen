const bcrypt = require('bcrypt')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

const getRootUserToken = async () => {
  const user = {
    username: 'root',
    password: 'password',
  }

  const response = await api
    .post('/api/login')
    .send(user)

  const token = 'Bearer ' + response._body.token
  return token
}


describe('When there are blogs in database', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are all returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 4)
  })

  test('blog title is updated', async () => {
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

  test('blog author is updated', async () => {
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

  test('blog url is updated', async () => {
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

  test('blog likes are updated', async () => {
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

  test('unique identifier is named id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach((blog) => {
      assert(blog.hasOwnProperty('id') === true)
      assert(blog.hasOwnProperty('_id') === false)
    })
  })
})





describe('When there are no blogs in database', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
  })

  test('blog is not added to database when no token is given', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const userId = await helper.getRootUserId()

    const noTokenBlog = {
      title: '123',
      author: '123',
      url: '123',
      likes: 1,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .send(noTokenBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const title = response.body.map(r => r.title)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtBeginning.length, blogsAtEnd.length)
  })

  test('blog is added to database when valid token is given', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const userId = await helper.getRootUserId()
    const token = await getRootUserToken()

    const validTokenBlog = {
      title: '123',
      author: '123',
      url: '123',
      likes: 1,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(validTokenBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtBeginning.length, blogsAtEnd.length - 1)
    assert(titles.includes('123'))
  })

  test('blog is removed from the database', async () => {
    const userId = await helper.getRootUserId()
    const token = await getRootUserToken()

    const newBlog = {
      title: '123',
      author: '123',
      url: '123',
      likes: 1,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtBeginning = await helper.blogsInDb()
    const blogToDelete = blogsAtBeginning[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, 0)
  })


  test('title must be set', async () => {
    const userId = await helper.getRootUserId()
    const token = await getRootUserToken()

    const noTitleBlog = {
      author: '123',
      url: '123',
      likes: 0,
      userId: userId
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(noTitleBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)
    assert(result.body.error.includes('title missing'))
  })

  test('url must be set', async () => {
    const userId = await helper.getRootUserId()
    const token = await getRootUserToken()

    const noUrlBlog = {
      title: '123',
      author: '123',
      likes: 0,
      userId: userId
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(noUrlBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)
    assert(result.body.error.includes('url missing'))
  })

  test('likes default to 0', async () => {
    const userId = await helper.getRootUserId()
    const token = await getRootUserToken()

    const noLikesBlog = {
      title: '123',
      author: '123',
      url: '123',
      userId: userId
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(noLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 1)
    assert.strictEqual(result._body.title, '123')
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
  })
})



after(async () => {
  await mongoose.connection.close()
})
