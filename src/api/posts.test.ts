import { API_BASE_URL } from '../config'
import type { Post } from '../types/Post'
import { createPost, deletePost, fetchPosts } from './posts'

function makePost(overrides: Partial<Post> = {}): Post {
  return { id: 1, userId: 1, title: 'Ada', body: 'lovelace', ...overrides }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchPosts', () => {
  it('requests the posts endpoint with a ten-post limit and returns the posts', async () => {
    const tenPosts = Array.from({ length: 10 }, (_, index) =>
      makePost({ id: index + 1 }),
    )
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(tenPosts), { status: 200 }),
    )

    const result = await fetchPosts()

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/posts?_limit=10`,
    )
    expect(result).toHaveLength(10)
    expect(result[0]).toEqual(makePost({ id: 1 }))
  })

  it('returns an empty array for an empty response body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    )

    const result = await fetchPosts()

    expect(result).toEqual([])
  })

  it('throws when the response body is not an array of valid posts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ oops: true }), { status: 200 }),
    )

    await expect(fetchPosts()).rejects.toThrow(/malformed|invalid/i)
  })

  it('throws an error naming the status when the response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 }),
    )

    await expect(fetchPosts()).rejects.toThrow(/500/)
  })
})

describe('createPost', () => {
  it('posts the input and returns the created post', async () => {
    const created = makePost({ id: 101, title: 'New', body: 'post' })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(created), { status: 201 }),
    )

    const result = await createPost({ title: 'New', body: 'post' })

    expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New', body: 'post' }),
    })
    expect(result).toEqual(created)
  })

  it('throws on a non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 }),
    )

    await expect(createPost({ title: 'New', body: 'post' })).rejects.toThrow(
      /500/,
    )
  })

  it('returns the created post when the API response omits userId, as JSONPlaceholder does', async () => {
    const responseBody = { id: 101, title: 'New', body: 'post' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseBody), { status: 201 }),
    )

    const result = await createPost({ title: 'New', body: 'post' })

    expect(result).toEqual({ id: 101, userId: 0, title: 'New', body: 'post' })
  })
})

describe('deletePost', () => {
  it('sends a DELETE request and resolves void on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 }),
    )

    const result = await deletePost(1)

    expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/posts/1`, {
      method: 'DELETE',
    })
    expect(result).toBeUndefined()
  })

  it('throws on a non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 500 }),
    )

    await expect(deletePost(1)).rejects.toThrow(/500/)
  })
})
