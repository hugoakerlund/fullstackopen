import { useState } from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, deleteBlog, likeBlog, user }) => {
  return (
    <div>
      <div>
        <h2>blogs</h2>
      </div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog} user={user} />
        )}
      </div>
    </div>
  )
}

export default BlogList
