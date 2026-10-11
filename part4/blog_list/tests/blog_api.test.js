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

test('blog is added to database', async () => {
  const blogsAtBeginning = await helper.blogsInDb()

  const newBlog = new Blog({
    title: "123",
    author: "123",
    url: "123",
    likes: 1,
  })
  await newBlog.save()

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtBeginning.length, blogsAtEnd.length - 1)
  assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].title, "123")
})


test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach((blog) => {
    console.log(blog)
    assert(blog.hasOwnProperty('id') === true)
    assert(blog.hasOwnProperty('_id') === false)
  })
})

test('likes property default to 0', async () => {
  const newBlog = new Blog({
    title: "123",
    author: "123",
    url: "123",
  })
  await newBlog.save()

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
})


after(async () => {
  await mongoose.connection.close()
})
