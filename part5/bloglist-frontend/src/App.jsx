import { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'


const App = () => {
  const [notification, setNotification] = useState({ message: null, error: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
          <BlogForm setNotification={setNotification} user={user} />
        </div>
      )}
    </div>
  )
}

export default App
