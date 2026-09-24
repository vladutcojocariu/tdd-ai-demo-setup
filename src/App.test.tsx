import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Post } from './types/Post'
import { App } from './App'

function makePost(overrides: Partial<Post> = {}): Post {
  return { id: 1, userId: 1, title: 'Ada', body: 'lovelace', ...overrides }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('loads and displays posts from the API on mount', async () => {
    const posts = [
      makePost({ id: 1, title: 'Ada' }),
      makePost({ id: 2, title: 'Grace' }),
    ]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(posts), { status: 200 }),
    )

    render(<App />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await screen.findByText('Ada')
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('shows an error alert when the initial GET fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 500 }),
    )

    render(<App />)

    await screen.findByRole('alert')
  })

  it('submits the form and puts the new post at the top of the list', async () => {
    const user = userEvent.setup()
    const existingPost = makePost({ id: 1, title: 'Existing post' })
    const createdPost = makePost({ id: 2, title: 'Ada', body: 'lovelace' })

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([existingPost]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(createdPost), { status: 201 }),
      )

    render(<App />)

    await screen.findByText('Existing post')

    await user.type(screen.getByLabelText(/title/i), 'Ada')
    await user.type(screen.getByLabelText(/body/i), 'lovelace')
    await user.click(screen.getByRole('button', { name: /add post/i }))

    await screen.findByText('Ada')

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Ada')
    expect(items[1]).toHaveTextContent('Existing post')
  })

  it('deletes a post when its delete button is clicked', async () => {
    const user = userEvent.setup()
    const postToDelete = makePost({ id: 1, title: 'Delete me' })
    const otherPost = makePost({ id: 2, title: 'Keep me' })

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([postToDelete, otherPost]), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }))

    render(<App />)

    await screen.findByText('Delete me')

    await user.click(
      screen.getByRole('button', { name: /delete "delete me"/i }),
    )

    await waitFor(() => {
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Keep me')).toBeInTheDocument()
  })

  it('shows an alert and keeps the post when the delete request fails', async () => {
    const user = userEvent.setup()
    const post = makePost({ id: 1, title: 'Stays put' })

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([post]), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 500 }))

    render(<App />)

    await screen.findByText('Stays put')

    await user.click(
      screen.getByRole('button', { name: /delete "stays put"/i }),
    )

    await screen.findByRole('alert')
    expect(screen.getByText('Stays put')).toBeInTheDocument()
  })
})
