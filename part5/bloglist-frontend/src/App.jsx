import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, error: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [_, setLikes] = useState(0)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) => parseFloat(b.likes) -  parseFloat(a.likes))
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleUsernameChange = async event => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = async event => {
    setPassword(event.target.value)
  }

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

  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    blog.user = user
    const returnedBlog = await blogService.create(blog)
    setBlogs(blogs.concat(returnedBlog))
  }

  const deleteBlog = async (blog) => {
    const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirmation) {
      await blogService.remove(blog)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotification({ message: `blog ${blog.title} by ${blog.author} deleted`, error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    blog.likes += 1
    setLikes(blog.likes)
    await blogService.update(blog)
  }

  return (
    <div>
      {!user && (
        <div>
          <LoginForm handleLogin={handleLogin} handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange} username={username}
            password={password} notification={notification} />
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification message={notification.message} error={notification.error} />
          <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
          <BlogForm createBlog={addBlog} setNotification={setNotification} user={user} blogFormRef={blogFormRef} />
        </div>
      )}
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog} username={user.name} />
        )}
      </div>
    </div>
  )
}

export default App
