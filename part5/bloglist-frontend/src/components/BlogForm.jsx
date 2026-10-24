import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog, setNotification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

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
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')

    navigate('/')

    setNotification({ message: `a new blog ${title} by ${author} added`, error: false })
    setTimeout(() => {
      setNotification({ message: null, error: false })
    }, 5000)
  }


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <label>
          title:<input value={title} onChange={handleTitleChange} /><br/>
        </label>
        <label>
          author:<input value={author} onChange={handleAuthorChange} /><br/>
        </label>
        <label>
          url:<input value={url} onChange={handleUrlChange} /><br/>
        </label>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
