import styled from 'styled-components'

const NotificationError = styled.div`
  background: #DB5C5C;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  margin: 10px;
  padding: 15px;
  color: black;
`

const NotificationSuccess = styled.div`
  background: #75E08E;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  margin: 10px;
  padding: 15px;
  color: black;
`

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  if (error) {
    return (
      <NotificationError>
        {message}
      </NotificationError>
    )
  }

  return (
    <NotificationSuccess>
      {message}
    </NotificationSuccess>
  )
}

export default Notification
