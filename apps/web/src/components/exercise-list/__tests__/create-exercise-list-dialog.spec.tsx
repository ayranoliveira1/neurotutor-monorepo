import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateExerciseListDialog } from '../create-exercise-list-dialog'

vi.mock('@/hooks/use-questions-metadata-query', () => ({
  useSubjectsQuery: vi.fn(() => ({
    data: ['Matemática', 'Português'],
  })),
  useYearsQuery: vi.fn(() => ({
    data: [2026, 2025, 2024],
  })),
  useDifficultiesQuery: vi.fn(() => ({
    data: ['EASY', 'MEDIUM', 'HARD'],
  })),
}))

vi.mock('@/actions/exercise-list/create-exercise-list', () => ({
  createExerciseListAction: vi.fn(),
}))

vi.mock('@next-safe-action/adapter-react-hook-form/hooks', async () => {
  const { useForm: useFormActual } =
    await vi.importActual<typeof import('react-hook-form')>('react-hook-form')
  return {
    useHookFormAction: (_action: unknown, resolver: unknown, opts: any) => {
      const form = useFormActual({ ...opts?.formProps, resolver })
      return {
        form,
        handleSubmitWithAction: form.handleSubmit(() => {}),
        action: { isPending: false, result: null },
      }
    },
  }
})

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open?: boolean
  }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    variant,
    size,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: string
    size?: string
  }) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    htmlFor,
    className,
  }: {
    children: React.ReactNode
    htmlFor?: string
    className?: string
  }) => <label htmlFor={htmlFor}>{children}</label>,
}))

describe('CreateExerciseListDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar formulário com campo de nome', () => {
    render(
      <CreateExerciseListDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Nome da lista')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Ex: Revisão ENEM 2025'),
    ).toBeInTheDocument()
  })

  it('deve renderizar seção inicial com disciplina e quantidade', () => {
    render(
      <CreateExerciseListDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Seção 1')).toBeInTheDocument()
    expect(screen.getByText('Disciplina')).toBeInTheDocument()
    expect(screen.getByText('Quantidade')).toBeInTheDocument()
  })

  it('deve adicionar nova seção ao clicar em Adicionar', async () => {
    const user = userEvent.setup()

    render(
      <CreateExerciseListDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Seção 1')).toBeInTheDocument()
    expect(screen.queryByText('Seção 2')).not.toBeInTheDocument()

    await user.click(screen.getByText('Adicionar'))

    expect(screen.getByText('Seção 1')).toBeInTheDocument()
    expect(screen.getByText('Seção 2')).toBeInTheDocument()
  })

  it('deve remover seção ao clicar no botão de remover', async () => {
    const user = userEvent.setup()

    render(
      <CreateExerciseListDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Adicionar'))

    expect(screen.getByText('Seção 1')).toBeInTheDocument()
    expect(screen.getByText('Seção 2')).toBeInTheDocument()

    const removeButtons = screen.getAllByRole('button', { name: '' })
    const trashButtons = removeButtons.filter(
      (btn) =>
        btn.querySelector('svg') !== null &&
        btn.getAttribute('type') === 'button' &&
        !btn.textContent?.trim(),
    )

    await user.click(trashButtons[0])

    expect(screen.queryByText('Seção 2')).not.toBeInTheDocument()
    expect(screen.getByText('Seção 1')).toBeInTheDocument()
  })
})
