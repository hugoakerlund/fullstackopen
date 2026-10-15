const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  let { title, author, url, likes, userId } = request.body

  likes = !likes ? 0 : likes

  const user = await User.findById(userId)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  if (!title) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (!url) {
    return response.status(400).json({ error: 'url missing' })
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  let foundBlog = await Blog.findById(request.params.id)
  if (!foundBlog) {
    return response.status(404).end()
  }

  foundBlog.title = title
  foundBlog.author = author
  foundBlog.url = url
  foundBlog.likes = likes

  const updatedBlog = await foundBlog.save()
  return response.status(204).json(updatedBlog)
})

module.exports = blogsRouter
