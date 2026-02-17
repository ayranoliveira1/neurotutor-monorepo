import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StarRating } from '../star-rating'

describe('StarRating', () => {
  it('should render 5 stars', () => {
    render(<StarRating value={0} />)

    const stars = screen.getAllByRole('radio')
    expect(stars).toHaveLength(5)
  })

  it('should have correct aria-labels', () => {
    render(<StarRating value={0} />)

    expect(screen.getByLabelText('1 estrela')).toBeInTheDocument()
    expect(screen.getByLabelText('2 estrelas')).toBeInTheDocument()
    expect(screen.getByLabelText('5 estrelas')).toBeInTheDocument()
  })

  it('should call onChange when a star is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<StarRating value={0} onChange={onChange} />)

    await user.click(screen.getByLabelText('3 estrelas'))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('should mark the correct star as checked', () => {
    render(<StarRating value={4} />)

    expect(screen.getByLabelText('4 estrelas')).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByLabelText('3 estrelas')).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('should not call onChange when disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<StarRating value={0} onChange={onChange} disabled />)

    await user.click(screen.getByLabelText('3 estrelas'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
