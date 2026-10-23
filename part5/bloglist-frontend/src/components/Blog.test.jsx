import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('<Blog /> renders only title and author by default ', async () => {

  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 10
  }
  const deleteBlog = vi.fn()
  const likeBlog = vi.fn()
  const username = 'test'

  const user = userEvent.setup()
  render(<Blog blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog} username={username} />)

  const header = screen.getByText('blog title blog author')
  expect(header).toBeVisible()

  const url = screen.queryByText('blog url')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes')
  expect(likes).toBeNull()
})
