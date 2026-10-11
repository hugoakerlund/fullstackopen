const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
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

test('blog is removed from the database', async () => {
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


test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach((blog) => {
    assert(blog.hasOwnProperty('id') === true)
    assert(blog.hasOwnProperty('_id') === false)
  })
})

test('likes property default to 0', async () => {
  const noLikesBlog = new Blog({
    title: "123",
    author: "123",
    url: "123",
  })
  await noLikesBlog.save()

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
})

test('title property must be set', async () => {
  const noTitleBlog = new Blog({
    author: "123",
    url: "123",
    likes: 0
  })

  await api
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)
})

test('url property must be set', async () => {
  const noUrlBlog = new Blog({
    title: "123",
    author: "123",
    likes: 0
  })

  await api
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)
})


after(async () => {
  await mongoose.connection.close()
})
