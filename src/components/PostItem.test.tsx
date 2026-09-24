import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Post } from '../types/Post'
import { PostItem } from './PostItem'

function makePost(overrides: Partial<Post> = {}): Post {
  return { id: 1, userId: 1, title: 'Ada', body: 'lovelace', ...overrides }
}

describe('PostItem', () => {
  it('calls onDelete with the post id when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <PostItem
        post={makePost({ id: 7 })}
        onDelete={onDelete}
        isDeleting={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(onDelete).toHaveBeenCalledWith(7)
  })

  it("renders the post's title and body as visible text", () => {
    render(
      <PostItem
        post={makePost({ title: 'Ada', body: 'lovelace' })}
        onDelete={vi.fn()}
        isDeleting={false}
      />,
    )

    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('lovelace')).toBeInTheDocument()
  })

  it('disables the delete button when isDeleting is true', () => {
    render(
      <PostItem
        post={makePost({ title: 'Ada' })}
        onDelete={vi.fn()}
        isDeleting={true}
      />,
    )

    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
  })

  it('gives the delete button an accessible name that distinguishes the post', () => {
    render(
      <PostItem
        post={makePost({ title: 'Ada' })}
        onDelete={vi.fn()}
        isDeleting={false}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Delete "Ada"' }),
    ).toBeInTheDocument()
  })
})
