const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  let { title, author, url, likes, userId } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  if (!title) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (!url) {
    return response.status(400).json({ error: 'url missing' })
  }

  likes = !likes ? 0 : likes

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

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({ error: 'blog does not exist' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'user that created blog does not exist' })
  }

  const blogCreatorId = blog.user.toString()
  const userId = user._id.toString()

  if (blogCreatorId === userId) {
    await Blog.findByIdAndDelete(request.params.id)
    const blogs = user.blogs.toString().split(',')
    let newBlogs = blogs.filter(b => !b.includes(request.params.id))
    user.blogs = newBlogs
    return response.status(204).end()

  }
  else {
    return response.status(400).end({ error: 'user is not the creator of the blog' })
  }
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
