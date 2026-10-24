import { useNavigate } from 'react-router-dom'

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = async event => {
    await onLogout(event)
    navigate('/')
  }

  return (
    <button onClick={handleLogout}>logout</button>
  )
}

export default LogoutButton
