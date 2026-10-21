import { useState, useEffect, useRef } from 'react'
import blogService from '../services/blogs'
import Blog from '../components/Blog'
import Togglable from '../components/Togglable'


const BlogForm = ({ setNotification, user}) => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) => parseFloat(b.likes) -  parseFloat(a.likes))
      setBlogs(blogs)
    })
  }, [])


  const handleTitleChange = async event => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = async event => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = async event => {
    setUrl(event.target.value)
  }

  const addBlog = async event => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    const blogObject = {
      title: title,
      author: author,
      url: url,
      user: user
    }


    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    setNotification({ message: `a new blog ${title} by ${author} added`, error: false })
    setTimeout(() => {
      setNotification({ message: null, error: false })
    }, 5000)
  }

  const deleteBlog = async (blog) => {
    const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirmation) {
      let response = await blogService.remove(blog)
      setBlogs(blogs.filter(b => b.id != blog.id))
      setNotification({ message: `blog ${blog.title} by ${blog.author} deleted`, error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }


  return (
  <div>
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          title:<input value={title} onChange={handleTitleChange} /><br/>
          author:<input value={author} onChange={handleAuthorChange} /><br/>
          url:<input value={url} onChange={handleUrlChange} /><br/>
          <button type="submit">create</button>
        </form>
      </div>
    </Togglable>
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} username={user.name} />
      )}
    </div>
  </div>
  )
}

export default BlogForm
