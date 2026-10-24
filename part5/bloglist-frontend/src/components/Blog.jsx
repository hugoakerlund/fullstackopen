import { useParams,  useNavigate } from 'react-router-dom'

const Blog = ({ blogs, removeBlog, likeBlog, user }) => {

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const navigate = useNavigate()

  const deleteBlog = async (blog) => {
    if (await removeBlog(blog)) {
      navigate('/')
    }
  }

  return (
    <div className='blog'>
      <div className='blogHeader'>
        {blog.author}: {blog.title}
      </div>
      <div className='blogDetails'>
        <div id='blogUrl'>
          <a hfef={blog.url}>{blog.url}</a><br/>
        </div>
        <div id='blogLikes'>
          likes {blog.likes}
          {user && user.name === blog.user.name && (
            <button onClick={() => likeBlog(blog)}>like</button>
          )}
        </div>
        Added By {blog.user.name}<br/>
        {user && user.name === blog.user.name && (
          <button onClick={() => deleteBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
