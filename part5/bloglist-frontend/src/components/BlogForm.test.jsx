import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {

  test('calls addBlog with right details when a new blog is created', async () => {

    const testUser = userEvent.setup()
    const createBlog = vi.fn()
    const setNotification = vi.fn()

    render(<BlogForm createBlog={createBlog} setNotification={setNotification} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const createButton = screen.getByText('create')

    await testUser.type(titleInput, 'testing title input')
    await testUser.type(authorInput, 'testing author input')
    await testUser.type(urlInput, 'testing url input')
    await testUser.click(createButton)

    expect(createBlog.mock.calls[0].length).toBe(1)
    expect(createBlog.mock.calls[0][0].title).not.toBe(null)
    expect(createBlog.mock.calls[0][0].author).not.toBe(null)
    expect(createBlog.mock.calls[0][0].url).not.toBe(null)
  })
})
