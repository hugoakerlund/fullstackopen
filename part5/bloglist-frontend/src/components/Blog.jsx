import { useState } from 'react'

const Blog = ({ blog, deleteBlog, likeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
    <div className='blog'>
      <div className='blogHeader'>
        {blog.title} {blog.author} <button onClick={() => setDetailsVisible(!detailsVisible)}>{detailsVisible === true ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div className='blogDetails'>
          <div id='blogUrl'>
            {blog.url}<br/>
          </div>
          <div id='blogLikes'>
            likes {blog.likes}<button onClick={() => likeBlog(blog)}>like</button><br/>
          </div>
          {blog.user.name}<br/>
          { user && user.name === blog.user.name && (
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
        </div>
      )
      }
    </div>
  )
}

export default Blog
