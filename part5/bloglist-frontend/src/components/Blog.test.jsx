import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('<Blog /> renders only title and author by default', async () => {

  const blogUser = { name: 'test' }

  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 10,
    user: blogUser
  }

  const deleteBlog = vi.fn()
  const likeBlog = vi.fn()
  const username = blogUser.name

  const testUser = userEvent.setup()

  render(<Blog blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog} username={username} />)

  const header = screen.getByText('blog title blog author')
  expect(header).toBeVisible()

  const url = screen.queryByText('blog url')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes')
  expect(likes).toBeNull()
})

test('Url and likes are shown when view button is clicked', async () => {

  const blogUser = { name: 'test' }

  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 10,
    user: blogUser
  }
  const deleteBlog = vi.fn()
  const likeBlog = vi.fn()
  const username = blogUser.name

  const testUser = userEvent.setup()

  const { container } = render(<Blog blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog} username={username} />)

  const viewButton = screen.getByText('view')
  await testUser.click(viewButton)

  const url = container.querySelector('#blogUrl')
  expect(url).not.toBeNull()

  const likes = container.querySelector('#blogLikes')
  expect(likes).not.toBeNull()
})
