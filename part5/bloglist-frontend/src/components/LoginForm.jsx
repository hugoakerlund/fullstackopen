import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

const Input = styled.input`
  padding: 1em;
  margin: 0.5em;
  color: "#0E183D";
  background: #76C1CC;
  border: none;
`

const Button = styled.button`
  background-color: #000000;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  min-height: 20px;
  padding: 8px 12px;
  text-align: center;
`

const LoginForm = ({ onLogin, handleUsernameChange, handlePasswordChange, username, password }) => {
  const navigate = useNavigate()

  const handleLogin = async event => {
    if(await onLogin(event)) {
      navigate('/')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="username"
            />
          </label>
        </div>
        <div>
          <label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="password"
            />
          </label>
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginForm
