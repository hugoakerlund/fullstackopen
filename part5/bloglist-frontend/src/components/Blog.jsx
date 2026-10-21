import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const likeBlog = async event => {
    blog.likes += 1
    setLikes(blog.likes)
    await blogService.update(blog)
  }

  return (
  <div className='blogList'>
    <div>
      {blog.title} {blog.author} <button onClick={() => setDetailsVisible(!detailsVisible)}>{detailsVisible === true ? 'hide' : 'view'}</button>
    </div>
    {detailsVisible && (
    <div>
      {blog.url}<br/>
      likes {blog.likes}<button onClick={likeBlog}>like</button><br/>
      {blog.user.name}
    </div>
    )}
  </div>
)}

export default Blog
