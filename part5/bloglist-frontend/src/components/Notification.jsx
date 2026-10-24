const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  if (error) {
    return (
      <div className="notification">
        <div className="error">
          {message}
        </div>
      </div>
    )
  }

  return (
    <div className="notification">
      <div className="success">
        {message}
      </div>
    </div>
  )
}

export default Notification
