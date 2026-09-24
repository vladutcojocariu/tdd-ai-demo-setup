export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export type CreatePostInput = Pick<Post, 'title' | 'body'>
