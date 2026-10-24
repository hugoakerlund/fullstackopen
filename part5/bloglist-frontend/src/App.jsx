import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LogoutButton from './components/LogoutButton'
import Blog from './components/Blog'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, error: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const updateBlogs = () => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) => parseFloat(b.likes) -  parseFloat(a.likes))
      setBlogs(blogs)
    })
  }

  useEffect(() => {
    updateBlogs()
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
      return false
    }
    return true
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
      setNotification({ message: 'error logging out', error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }

  const addBlog = async (blog) => {
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
      return true
    }
    return false
  }

  const likeBlog = async (blog) => {
    blog.likes += 1
    await blogService.update(blog)
    updateBlogs()
  }

  return (
    <Router>
      <div>
        <Link to="/">blogs</Link>
        {user && (
          <span>
            <Link to="/create">new blog</Link>
            <LogoutButton onLogout={handleLogout} />
          </span>
        )}
        {!user && (
          <Link to="/login">login</Link>
        )}
        <Notification message={notification.message} error={notification.error} />
      </div>

      <Routes>
        <Route path="/" element={
         <BlogList blogs={blogs} />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={addBlog} setNotification={setNotification} />
        } />
        <Route path="/login" element={
          <LoginForm onLogin={handleLogin} handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange} username={username} password={password} />
         } />
        <Route path="/:id" element={
          <Blog blogs={blogs} removeBlog={deleteBlog} likeBlog={likeBlog} user={user} />
         } />
      </Routes>
    </Router>
  )
}

export default App
