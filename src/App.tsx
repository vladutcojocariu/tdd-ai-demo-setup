import { PostForm } from './components/PostForm'
import { PostList } from './components/PostList'
import { usePosts } from './hooks/usePosts'

export function App() {
  const {
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
  } = usePosts()

  return (
    <main className="app-shell">
      <h1>Posts</h1>
      <PostForm
        onSubmit={createPost}
        isSubmitting={isCreating}
        validationError={validationError}
        submitError={createError}
      />
      {deleteError ? <p role="alert">{deleteError}</p> : null}
      <PostList
        posts={posts}
        isLoading={isLoading}
        error={loadError}
        onDelete={deletePost}
        deletingId={deletingId}
      />
    </main>
  )
}
