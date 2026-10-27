import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

const Input = styled.input`
  padding: 1em;
  margin: 0.5em;
  color: "#0E183D";
  background: #CFCFCF;
  border: 2px solid cyan;
  border-radius: 5px;
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
          <Input value={title} onChange={handleTitleChange} placeholder="title" /><br/>
        </label>
        <label>
          <Input value={author} onChange={handleAuthorChange} placeholder="author" /><br/>
        </label>
        <label>
          <Input value={url} onChange={handleUrlChange} placeholder="url" /><br/>
        </label>
        <Button type="submit">create</Button>
      </form>
    </div>
  )
}

export default BlogForm
