import { API_BASE_URL } from '../config'
import type { CreatePostInput, Post } from '../types/Post'

function isValidPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.userId === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.body === 'string'
  )
}

function assertValidPosts(value: unknown): asserts value is Post[] {
  if (!Array.isArray(value) || !value.every(isValidPost)) {
    throw new Error('Received malformed posts data from the API')
  }
}

// JSONPlaceholder's fake POST /posts endpoint echoes back only the submitted
// fields plus an id, so a created post never comes back with a userId.
function isValidCreatedPost(
  value: unknown,
): value is Pick<Post, 'id' | 'title' | 'body'> & Partial<Pick<Post, 'userId'>> {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.body === 'string' &&
    (candidate.userId === undefined || typeof candidate.userId === 'number')
  )
}

function assertValidCreatedPost(
  value: unknown,
): asserts value is Pick<Post, 'id' | 'title' | 'body'> &
  Partial<Pick<Post, 'userId'>> {
  if (!isValidCreatedPost(value)) {
    throw new Error('Received malformed post data from the API')
  }
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts?_limit=10`)
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`)
  }
  const body: unknown = await response.json()
  assertValidPosts(body)
  return body
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`)
  }
  const body: unknown = await response.json()
  assertValidCreatedPost(body)
  return { userId: 0, ...body }
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete post: ${response.status}`)
  }
}
