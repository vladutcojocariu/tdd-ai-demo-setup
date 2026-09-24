import type { Post } from '../types/Post'
import { PostItem } from './PostItem'

interface PostListProps {
  posts: Post[]
  isLoading: boolean
  error?: string | null
  onDelete: (id: number) => void
  deletingId: number | null
}

export function PostList({
  posts,
  isLoading,
  error,
  onDelete,
  deletingId,
}: PostListProps) {
  if (isLoading) {
    return <p>Loading posts…</p>
  }

  return (
    <>
      {error && <p role="alert">{error}</p>}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onDelete={onDelete}
              isDeleting={post.id === deletingId}
            />
          ))}
        </ul>
      )}
    </>
  )
}
