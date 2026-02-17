import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RatingPopup } from '../rating-popup'

vi.mock('@/actions/rating/get-user-rating', () => ({
  getUserRating: vi.fn(),
}))

vi.mock('@/actions/rating/create-rating', () => ({
  createRatingAction: vi.fn(),
}))

vi.mock('next-safe-action/hooks', () => ({
  useAction: vi.fn(() => ({
    execute: vi.fn(),
    isPending: false,
    result: {},
  })),
}))

import { getUserRating } from '@/actions/rating/get-user-rating'
import { useAction } from 'next-safe-action/hooks'

const mockGetUserRating = vi.mocked(getUserRating)
const mockUseAction = vi.mocked(useAction)

function getPopup() {
  return screen.getByTestId('rating-popup')
}

describe('RatingPopup', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockGetUserRating.mockResolvedValue(null)
    mockUseAction.mockReturnValue({
      execute: vi.fn(),
      isPending: false,
      result: {},
    } as any)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not show popup initially', async () => {
    render(<RatingPopup userId="user-1" />)

    await waitFor(() => {
      expect(mockGetUserRating).toHaveBeenCalled()
    })

    expect(getPopup()).toHaveAttribute('aria-hidden', 'true')
  })

  it('should show popup after 3 seconds on first load', async () => {
    render(<RatingPopup userId="user-1" />)

    await waitFor(() => {
      expect(mockGetUserRating).toHaveBeenCalled()
    })

    vi.advanceTimersByTime(3_000)

    await waitFor(() => {
      expect(getPopup()).toHaveAttribute('aria-hidden', 'false')
    })
  })

  it('should not show popup when user already rated', async () => {
    mockGetUserRating.mockResolvedValue({
      id: 'rating-1',
      userId: 'user-1',
      rating: 5,
      description: 'Ótimo!',
      createdAt: new Date().toISOString(),
    })

    render(<RatingPopup userId="user-1" />)

    await waitFor(() => {
      expect(mockGetUserRating).toHaveBeenCalled()
    })

    vi.advanceTimersByTime(3_000)

    expect(screen.queryByTestId('rating-popup')).not.toBeInTheDocument()
  })

  it('should reopen after 10 minutes when closed without rating', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    render(<RatingPopup userId="user-1" />)

    await waitFor(() => {
      expect(mockGetUserRating).toHaveBeenCalled()
    })

    vi.advanceTimersByTime(3_000)

    await waitFor(() => {
      expect(getPopup()).toHaveAttribute('aria-hidden', 'false')
    })

    await user.click(screen.getByText('Agora não'))

    expect(getPopup()).toHaveAttribute('aria-hidden', 'true')

    vi.advanceTimersByTime(600_000)

    await waitFor(() => {
      expect(getPopup()).toHaveAttribute('aria-hidden', 'false')
    })
  })

  it('should render star rating and optional description field', async () => {
    render(<RatingPopup userId="user-1" />)

    await waitFor(() => {
      expect(mockGetUserRating).toHaveBeenCalled()
    })

    vi.advanceTimersByTime(3_000)

    await waitFor(() => {
      expect(screen.getByText('Sua avaliação')).toBeInTheDocument()
      expect(screen.getByLabelText('Descrição (opcional)')).toBeInTheDocument()
      expect(screen.getByText('Enviar avaliação')).toBeInTheDocument()
    })
  })

  it('should show error when submitting without selecting rating', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    render(<RatingPopup userId="user-1" />)

    await waitFor(() => {
      expect(mockGetUserRating).toHaveBeenCalled()
    })

    vi.advanceTimersByTime(3_000)

    await waitFor(() => {
      expect(getPopup()).toHaveAttribute('aria-hidden', 'false')
    })

    await user.click(screen.getByText('Enviar avaliação'))

    expect(screen.getByText('Selecione uma avaliação')).toBeInTheDocument()
  })
})
