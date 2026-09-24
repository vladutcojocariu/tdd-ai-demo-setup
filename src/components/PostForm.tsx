import { useEffect, useRef, useState } from 'react'
import type { CreatePostInput } from '../types/Post'

export interface PostFormProps {
  onSubmit: (input: CreatePostInput) => void
  isSubmitting: boolean
  validationError?: string | null
  submitError?: string | null
}

export function PostForm({
  onSubmit,
  isSubmitting,
  validationError,
  submitError,
}: PostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const wasSubmittingRef = useRef(false)

  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting && !submitError) {
      setTitle('')
      setBody('')
    }
    wasSubmittingRef.current = isSubmitting
  }, [isSubmitting, submitError])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ title, body })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="post-title">Title</label>
      <input
        id="post-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="post-body">Body</label>
      <textarea
        id="post-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />

      {validationError ? <p>{validationError}</p> : null}
      {submitError ? <p role="alert">{submitError}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        Add post
      </button>
    </form>
  )
}
