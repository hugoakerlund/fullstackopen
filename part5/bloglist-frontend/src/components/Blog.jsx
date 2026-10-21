import { useState } from 'react'

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
  <div className='blogList'>
    <div>
      {blog.title} {blog.author} <button onClick={() => setDetailsVisible(!detailsVisible)}>{detailsVisible === true ? 'hide' : 'view'}</button>
    </div>
    {detailsVisible && (
    <div>
      {blog.url}<br/>
      likes {blog.likes}<button onClick={() => console.log("likes button cliked")}>like</button><br/>
      {blog.user.name}
    </div>
    )}
  </div>
)}

export default Blog
