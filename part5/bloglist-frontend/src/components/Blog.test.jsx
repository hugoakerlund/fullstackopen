import { render, screen } from '@testing-library/react'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {

  test('information and the number of likes are displayed to unauthenticated users, buttons are not displayed', async () => {
    const blogUser = { name: 'test' }
    const blogs = [
      {
        title: 'title',
        author: 'author',
        url: 'url',
        likes: 1,
        user: blogUser
      }
    ]

    const deleteBlog = vi.fn()
    const likeBlog = vi.fn()

    render(
      <Router>
        <Blog blogs={blogs} deleteBlog={deleteBlog} likeBlog={likeBlog} user={null} />
      </Router>
    )

    const header = screen.getByText('author: title')
    expect(header).toBeVisible()

    const url = screen.queryByText('url')
    expect(url).toBeVisible()

    const likes = screen.queryByText('likes 1')
    expect(likes).toBeVisible()

    const likeButton = screen.queryByText('like')
    expect(likeButton).toBeNull()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('authenticated users who are not the blog’s creator are shown only the like button', async () => {
    const blogUser = { name: 'test' }
    const authenticatedUser = { name: 'authenticated user' }

    const blogs = [
      {
        title: 'title',
        author: 'author',
        url: 'url',
        likes: 1,
        user: blogUser
      }
    ]

    const deleteBlog = vi.fn()
    const likeBlog = vi.fn()

    render(
      <Router>
        <Blog blogs={blogs} deleteBlog={deleteBlog} likeBlog={likeBlog} user={authenticatedUser} />
      </Router>
    )

    const likeButton = screen.queryByText('like')
    expect(likeButton).toBeVisible()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('the blog’s creator is also shown the delete button', async () => {
    const blogUser = { name: 'test' }
    const blogs = [
      {
        title: 'title',
        author: 'author',
        url: 'url',
        likes: 1,
        user: blogUser
      }
    ]

    const deleteBlog = vi.fn()
    const likeBlog = vi.fn()

    render(
      <Router>
        <Blog blogs={blogs} deleteBlog={deleteBlog} likeBlog={likeBlog} user={blogUser} />
      </Router>
    )

    const likeButton = screen.queryByText('like')
    expect(likeButton).toBeVisible()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeVisible()
  })
})
