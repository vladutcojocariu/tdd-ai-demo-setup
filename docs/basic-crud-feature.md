# Feature description:

Build a homepage that displays posts from the JSONPlaceholder API (https://jsonplaceholder.typicode.com/posts) and lets the user create and delete posts against that same fake API.

# Requirements:

## Fetch and display posts

- On mount, fetch posts from GET /posts (limit to the first 10 for a manageable UI).
- Show a loading state while the request is in flight.
- Render each post's title and body in a list.
- Show a clear error state if the fetch fails.

## Create a post

- A small form (title + body fields) with a submit button.
- On submit, POST /posts with the entered data.
- Since JSONPlaceholder doesn't persist data, optimistically add the returned (fake) post to the top of the local list so the UI reflects the action.
- Disable the submit button while the request is pending, and show a validation error if title or body is empty.
- Show an error state if the POST fails.

## Delete a post

- A delete button/icon per post.
- On click, DELETE /posts/:id.
- Since JSONPlaceholder doesn't persist data, remove the post from local state on success regardless of what the API returns.
- Show a brief pending/disabled state on the specific post being deleted.
- Show an error state if the DELETE fails (and don't remove the item from the list in that case).
