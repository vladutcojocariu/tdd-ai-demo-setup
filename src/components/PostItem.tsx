import type { Post } from '../types/Post'

interface PostItemProps {
  post: Post
  onDelete: (id: number) => void
  isDeleting: boolean
}

export function PostItem({ post, onDelete, isDeleting }: PostItemProps) {
  return (
    <li className="post-item">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <button
        type="button"
        disabled={isDeleting}
        onClick={() => onDelete(post.id)}
      >
        {`Delete "${post.title}"`}
      </button>
    </li>
  )
}
