import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuestionsPageSkeleton } from '../questions-page-skeleton'

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('QuestionsPageSkeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar sem erros', () => {
    const { container } = render(<QuestionsPageSkeleton />)

    expect(container).toBeTruthy()
  })

  it('deve renderizar elementos skeleton', () => {
    render(<QuestionsPageSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
