import { useState } from 'react'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <div>
        <h2>blogs</h2>
      </div>
      <div>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/${blog.id}`} data-testid="blog-link">{blog.title}</Link>
          </li>
        )}
      </ul>
      </div>
    </div>
  )
}

export default BlogList
