const BlogForm = ({
  addBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
      title:<input value={title} onChange={handleTitleChange} /><br/>
      author:<input value={author} onChange={handleAuthorChange} /><br/>
      url:<input value={url} onChange={handleUrlChange} /><br/>
      <button type="submit">create</button>
    </form>
  </div>
)

export default BlogForm
