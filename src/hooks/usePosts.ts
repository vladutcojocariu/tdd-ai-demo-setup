import { useCallback, useEffect, useState } from 'react'
import {
  createPost as createPostRequest,
  deletePost as deletePostRequest,
  fetchPosts,
} from '../api/posts'
import type { CreatePostInput, Post } from '../types/Post'

export interface UsePostsResult {
  posts: Post[]
  isLoading: boolean
  loadError: string | null
  createPost: (input: CreatePostInput) => Promise<void>
  isCreating: boolean
  createError: string | null
  validationError: string | null
  deletePost: (id: number) => Promise<void>
  deletingId: number | null
  deleteError: string | null
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong'
}

export function usePosts(): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    // Guards against setting state from a request superseded by StrictMode's double-invoke or unmount.
    let ignore = false

    fetchPosts()
      .then((result) => {
        if (ignore) return
        setPosts(result)
        setLoadError(null)
      })
      .catch((error: unknown) => {
        if (ignore) return
        setLoadError(getErrorMessage(error))
      })
      .finally(() => {
        if (ignore) return
        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const createPost = useCallback(async (input: CreatePostInput) => {
    if (!input.title.trim() || !input.body.trim()) {
      setValidationError('Title and body are required')
      return
    }
    setValidationError(null)
    setIsCreating(true)
    setCreateError(null)
    try {
      const created = await createPostRequest(input)
      setPosts((current) => [created, ...current])
    } catch (error) {
      setCreateError(getErrorMessage(error))
    } finally {
      setIsCreating(false)
    }
  }, [])

  const deletePost = useCallback(async (id: number) => {
    setDeletingId(id)
    setDeleteError(null)
    try {
      await deletePostRequest(id)
      setPosts((current) => current.filter((post) => post.id !== id))
    } catch (error) {
      setDeleteError(getErrorMessage(error))
    } finally {
      setDeletingId(null)
    }
  }, [])

  return {
    posts,
    isLoading,
    loadError,
    createPost,
    isCreating,
    createError,
    validationError,
    deletePost,
    deletingId,
    deleteError,
  }
}
