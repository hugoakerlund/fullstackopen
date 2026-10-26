import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

const Button = styled.button`
  background-color: #000000;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
`

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = async event => {
    await onLogout(event)
    navigate('/')
  }

  return (
    <Button onClick={handleLogout}>logout</Button>
  )
}

export default LogoutButton
