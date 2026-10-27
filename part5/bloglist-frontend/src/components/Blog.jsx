import { useParams,  useNavigate } from 'react-router-dom'

import styled from 'styled-components'


const BlogTitle= styled.div`
  color: #DB481F;
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
`

const BlogAuthor = styled.div`
  color: #C46149;
  font-style: normal;
  font-size: 18px;
`

const BlogUrl = styled.a`
  color: red;
  cursor: pointer;
  text-decoration-line: underline;
`

const BlogPage = styled.div`
  padding: 20px 20px 20px 20px;
  border-style: solid;
  border-width: 2px;
  margin: 10px 10px;
`

const BlogDetails = styled.div`
`

const BlogLastRow= styled.div`
  display: inline;
  color: white;
`

const LikeButton = styled.button`
  background-color: #1b1b1b;
  border: 1px dashed cyan;
  border-radius: 10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
`

const RemoveButton = styled.button`
  background-color: #1b1b1b;
  border: 1px dashed red;
  border-radius: 10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
`

const Blog = ({ blogs, removeBlog, likeBlog, user }) => {

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const deleteBlog = async (blog) => {
    if (await removeBlog(blog)) {
      navigate('/')
    }
  }

  return (
    <BlogPage>

      <BlogTitle>
        {blog.title}
      </BlogTitle>

      <BlogAuthor>
        by {blog.author}
      </BlogAuthor>

      <BlogDetails>

        <BlogUrl hfef={blog.url}>{blog.url}</BlogUrl> <br/>
        Added by {blog.user.name}<br/>

        <BlogLastRow>
          {blog.likes} likes
          {user && user.name === blog.user.name && (
            <RemoveButton onClick={() => deleteBlog(blog)}>remove</RemoveButton>
          )}
          {user && (
            <LikeButton onClick={() => likeBlog(blog)}>like</LikeButton>
          )}
        </BlogLastRow>

      </BlogDetails>

    </BlogPage>
  )
}

export default Blog
