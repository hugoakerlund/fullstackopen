const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  let body = request.body._doc

  if (!body.hasOwnProperty('title')) {
    response.status(400).end()
  }
  else if (!body.hasOwnProperty('url')) {
    response.status(400).end()
  }
  else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
})

module.exports = blogsRouter
