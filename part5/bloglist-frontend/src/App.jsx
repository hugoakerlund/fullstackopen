import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({ message: null, error: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
            'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'wrong username or password', error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    console.log('logging out')

    try {
      window.localStorage.removeItem('loggedBlogappUser')

      blogService.setToken('')
      setUser('')
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'error logging out', error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }

  const handleUsernameChange = async event => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = async event => {
    setPassword(event.target.value)
  }

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

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        addBlog={addBlog}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
        title={title}
        author={author}
        url={url}
      />
    </Togglable>
  )

  return (
    <div>
    {!user && (
      <div>
      {LoginForm({
        handleLogin,
        handleUsernameChange,
        handlePasswordChange,
        username,
        password,
        notification
      })}
      </div>
    )}

    {user && (
      <div>
        <h2>blogs</h2>
        <Notification message={notification.message} error={notification.error} />
        <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>

        {blogForm()}

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      )}
    </div>
  )
}

export default App
