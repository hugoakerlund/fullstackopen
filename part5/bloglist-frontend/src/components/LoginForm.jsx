import Notification from '../components/Notification'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ onLogin, handleUsernameChange, handlePasswordChange, username, password, notification }) => {
  const navigate = useNavigate()

  const handleLogin = async event => {
    await onLogin(event)
    navigate('/')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={notification.message} error={notification.error} />
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
