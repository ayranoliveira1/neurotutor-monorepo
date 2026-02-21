import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RatingsPagination } from '../ratings-pagination'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/admin/avaliacoes',
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    'aria-label'?: string
  }) => (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}))

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>&lt;</span>,
  ChevronRight: () => <span>&gt;</span>,
}))

describe('RatingsPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
  })

  it('deve renderizar total de avalia\u00e7\u00f5es no singular', () => {
    render(
      <RatingsPagination
        currentPage={1}
        totalPages={1}
        totalItems={1}
      />,
    )

    expect(
      screen.getByText('1 avalia\u00e7\u00e3o encontrada'),
    ).toBeInTheDocument()
  })

  it('deve renderizar total de avalia\u00e7\u00f5es no plural', () => {
    render(
      <RatingsPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          !!element?.textContent?.includes('50') &&
          !!element?.textContent?.includes('avalia\u00e7\u00e3o') &&
          !!element?.textContent?.includes('encontrada'),
      ),
    ).toBeInTheDocument()
  })

  it('deve renderizar informa\u00e7\u00e3o de p\u00e1gina atual', () => {
    render(
      <RatingsPagination
        currentPage={3}
        totalPages={10}
        totalItems={100}
      />,
    )

    expect(screen.getByText('P\u00e1gina 3 de 10')).toBeInTheDocument()
  })

  it('deve desabilitar bot\u00e3o anterior na primeira p\u00e1gina', () => {
    render(
      <RatingsPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(screen.getByLabelText('P\u00e1gina anterior')).toBeDisabled()
  })

  it('deve desabilitar bot\u00e3o pr\u00f3xima na \u00faltima p\u00e1gina', () => {
    render(
      <RatingsPagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(screen.getByLabelText('Pr\u00f3xima p\u00e1gina')).toBeDisabled()
  })
})
