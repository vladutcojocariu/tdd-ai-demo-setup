import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostForm } from './PostForm'

describe('PostForm', () => {
  it('submits the entered title and body', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<PostForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.type(screen.getByLabelText(/title/i), 'Ada')
    await user.type(screen.getByLabelText(/body/i), 'lovelace')
    await user.click(screen.getByRole('button', { name: /add post/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Ada', body: 'lovelace' })
  })

  it('disables the submit button when isSubmitting is true', () => {
    render(<PostForm onSubmit={vi.fn()} isSubmitting={true} />)

    expect(screen.getByRole('button', { name: /add post/i })).toBeDisabled()
  })

  it('renders the validation error text when provided', () => {
    render(
      <PostForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        validationError="Title is required"
      />,
    )

    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })

  it('does not render validation error text when validationError is null', () => {
    render(
      <PostForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        validationError={null}
      />,
    )

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
  })

  it('renders the submit error inside an alert when provided', () => {
    render(
      <PostForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitError="Something went wrong"
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })

  it('clears the fields after a successful submit', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <PostForm onSubmit={vi.fn()} isSubmitting={false} />,
    )

    await user.type(screen.getByLabelText(/title/i), 'Ada')
    await user.type(screen.getByLabelText(/body/i), 'lovelace')

    rerender(<PostForm onSubmit={vi.fn()} isSubmitting={true} />)
    rerender(
      <PostForm onSubmit={vi.fn()} isSubmitting={false} submitError={null} />,
    )

    expect(screen.getByLabelText(/title/i)).toHaveValue('')
    expect(screen.getByLabelText(/body/i)).toHaveValue('')
  })

  it('does not clear the fields when submitError is set after a failed submit', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <PostForm onSubmit={vi.fn()} isSubmitting={false} />,
    )

    await user.type(screen.getByLabelText(/title/i), 'Ada')
    await user.type(screen.getByLabelText(/body/i), 'lovelace')

    rerender(<PostForm onSubmit={vi.fn()} isSubmitting={true} />)
    rerender(
      <PostForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitError="Something went wrong"
      />,
    )

    expect(screen.getByLabelText(/title/i)).toHaveValue('Ada')
    expect(screen.getByLabelText(/body/i)).toHaveValue('lovelace')
  })
})
