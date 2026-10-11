const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)


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


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 4)
})

test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach((blog) => {
    assert(blog.hasOwnProperty('id') === true)
    assert(blog.hasOwnProperty('_id') === false)
  })
})


after(async () => {
  await mongoose.connection.close()
})
