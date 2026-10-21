import { useState } from 'react'

const Blog = ({ blog, deleteBlog, likeBlog, username }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
    <div className='blogList'>
      <div>
        {blog.title} {blog.author} <button onClick={() => setDetailsVisible(!detailsVisible)}>{detailsVisible === true ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          {blog.url}<br/>
          likes {blog.likes}<button onClick={() => likeBlog(blog)}>like</button><br/>
          {blog.user.name}<br/>
          {username === blog.user.name && (
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
        </div>
      )
      }
    </div>
  )
}

export default Blog
