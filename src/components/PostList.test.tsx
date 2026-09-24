import { render, screen } from '@testing-library/react'
import type { Post } from '../types/Post'
import { PostList } from './PostList'

function makePost(overrides: Partial<Post> = {}): Post {
  return { id: 1, userId: 1, title: 'Ada', body: 'lovelace', ...overrides }
}

describe('PostList', () => {
  it('shows a loading indicator and renders no post items while isLoading is true', () => {
    render(
      <PostList
        posts={[makePost()]}
        isLoading={true}
        onDelete={vi.fn()}
        deletingId={null}
      />,
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders one list item per post, in the given order, inside a role="list"', () => {
    const posts = [
      makePost({ id: 1, title: 'First' }),
      makePost({ id: 2, title: 'Second' }),
    ]
    render(
      <PostList
        posts={posts}
        isLoading={false}
        onDelete={vi.fn()}
        deletingId={null}
      />,
    )

    const list = screen.getByRole('list')
    const items = screen.getAllByRole('listitem')
    expect(list).toBeInTheDocument()
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('First')
    expect(items[1]).toHaveTextContent('Second')
  })

  it('shows an explicit empty-state message when posts is [] and isLoading is false', () => {
    render(
      <PostList
        posts={[]}
        isLoading={false}
        onDelete={vi.fn()}
        deletingId={null}
      />,
    )

    expect(screen.getByText(/no posts/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('shows the error text inside an element with role="alert" when error is set', () => {
    render(
      <PostList
        posts={[]}
        isLoading={false}
        error="Something went wrong"
        onDelete={vi.fn()}
        deletingId={null}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })

  it('marks only the post whose id equals deletingId as pending/disabled', () => {
    const posts = [
      makePost({ id: 1, title: 'First' }),
      makePost({ id: 2, title: 'Second' }),
    ]
    render(
      <PostList
        posts={posts}
        isLoading={false}
        onDelete={vi.fn()}
        deletingId={1}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Delete "First"' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Delete "Second"' }),
    ).toBeEnabled()
  })
})
