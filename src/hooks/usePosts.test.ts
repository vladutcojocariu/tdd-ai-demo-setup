import { StrictMode, createElement } from 'react'
import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { Post } from '../types/Post'
import { usePosts } from './usePosts'

function makePost(overrides: Partial<Post> = {}): Post {
  return { id: 1, userId: 1, title: 'Ada', body: 'lovelace', ...overrides }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePosts', () => {
  it('exposes a loading state and then the fetched posts', async () => {
    const posts = [makePost({ id: 1 }), makePost({ id: 2, title: 'Grace' })]
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(posts), { status: 200 }),
    )

    const { result } = renderHook(() => usePosts())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.posts).toEqual([])

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.posts).toEqual(posts)
  })

  it('sets loadError and leaves posts empty when the initial fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => usePosts())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.loadError).toBeTruthy()
    expect(result.current.posts).toEqual([])
  })

  it('does not duplicate posts when the mount effect double-invokes under StrictMode', async () => {
    const posts = [makePost({ id: 1 }), makePost({ id: 2, title: 'Grace' })]
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(posts), { status: 200 }),
    )

    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(StrictMode, null, children)
    const { result } = renderHook(() => usePosts(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.posts).toHaveLength(posts.length)
    expect(result.current.posts).toEqual(posts)
  })

  describe('createPost', () => {
    it('sets a validation error and does not call the API when title or body is empty', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }))

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      const callsBefore = fetchSpy.mock.calls.length

      await act(async () => {
        await result.current.createPost({ title: '   ', body: 'post' })
      })

      expect(result.current.validationError).toBeTruthy()
      expect(result.current.posts).toEqual([])
      expect(fetchSpy.mock.calls.length).toBe(callsBefore)
    })

    it('clears validationError on a subsequent valid submit', async () => {
      const created = makePost({ id: 2, title: 'New', body: 'post' })
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([]), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(created), { status: 201 }),
        )

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.createPost({ title: '', body: '' })
      })
      expect(result.current.validationError).toBeTruthy()

      await act(async () => {
        await result.current.createPost({ title: 'New', body: 'post' })
      })

      expect(result.current.validationError).toBeNull()
      expect(result.current.posts).toEqual([created])
    })

    it('prepends the returned post to the top of posts on success', async () => {
      const existing = makePost({ id: 1, title: 'Existing' })
      const created = makePost({ id: 2, title: 'New', body: 'post' })
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([existing]), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(created), { status: 201 }),
        )

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.createPost({ title: 'New', body: 'post' })
      })

      expect(result.current.posts).toEqual([created, existing])
    })

    it('sets isCreating to true while the POST is in flight and false afterwards', async () => {
      let resolveCreate: (value: Response) => void = () => {}
      const deferred = new Promise<Response>((resolve) => {
        resolveCreate = resolve
      })
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([]), { status: 200 }),
        )
        .mockReturnValueOnce(deferred)

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        void result.current.createPost({ title: 'New', body: 'post' })
      })

      await waitFor(() => expect(result.current.isCreating).toBe(true))

      await act(async () => {
        resolveCreate(
          new Response(
            JSON.stringify(makePost({ id: 2, title: 'New', body: 'post' })),
            {
              status: 201,
            },
          ),
        )
        await deferred
      })

      await waitFor(() => expect(result.current.isCreating).toBe(false))
    })

    it('sets createError and leaves posts unchanged when the POST rejects', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([]), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({}), { status: 500 }),
        )

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.createPost({ title: 'New', body: 'post' })
      })

      expect(result.current.createError).toBeTruthy()
      expect(result.current.posts).toEqual([])
    })
  })

  describe('deletePost', () => {
    it('removes the post from posts on a successful delete, leaving others untouched', async () => {
      const postA = makePost({ id: 1, title: 'A' })
      const postB = makePost({ id: 2, title: 'B' })
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([postA, postB]), { status: 200 }),
        )
        .mockResolvedValueOnce(new Response(null, { status: 200 }))

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.deletePost(postA.id)
      })

      expect(result.current.posts).toEqual([postB])
      expect(result.current.deletingId).toBeNull()
    })

    it('tracks deletingId per post while a DELETE is in flight, not as a global boolean', async () => {
      const postA = makePost({ id: 1, title: 'A' })
      const postB = makePost({ id: 2, title: 'B' })
      let resolveDelete: (value: Response) => void = () => {}
      const deferred = new Promise<Response>((resolve) => {
        resolveDelete = resolve
      })
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([postA, postB]), { status: 200 }),
        )
        .mockReturnValueOnce(deferred)

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        void result.current.deletePost(postA.id)
      })

      await waitFor(() => expect(result.current.deletingId).toBe(postA.id))
      expect(result.current.deletingId).not.toBe(postB.id)

      await act(async () => {
        resolveDelete(new Response(null, { status: 200 }))
        await deferred
      })

      await waitFor(() => expect(result.current.deletingId).toBeNull())
      expect(result.current.posts).toEqual([postB])
    })

    it('sets deleteError and keeps the post in the list when the DELETE rejects', async () => {
      const postA = makePost({ id: 1, title: 'A' })
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify([postA]), { status: 200 }),
        )
        .mockResolvedValueOnce(new Response(null, { status: 500 }))

      const { result } = renderHook(() => usePosts())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.deletePost(postA.id)
      })

      expect(result.current.deleteError).toBeTruthy()
      expect(result.current.posts).toEqual([postA])
    })
  })
})
