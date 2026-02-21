import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreatePlanDialog } from '../create-plan-dialog'

vi.mock('@next-safe-action/adapter-react-hook-form/hooks', async () => {
  const { useForm: useFormActual } = await vi.importActual<
    typeof import('react-hook-form')
  >('react-hook-form')

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

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: (schema: unknown) => schema,
}))

vi.mock('@/actions/admin/create-plan', () => ({
  createPlanAction: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open: boolean
  }) => (open ? <div role="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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
  }: {
    children: React.ReactNode
    htmlFor?: string
  }) => <label htmlFor={htmlFor}>{children}</label>,
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({
    options,
    placeholder,
    id,
    ...props
  }: {
    options: { value: string; label: string }[]
    placeholder?: string
    id?: string
    value?: string
    onChange?: (e: { target: { value: string } }) => void
  }) => (
    <select id={id} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    variant,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: string
  }) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}))

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  onSuccess: vi.fn(),
}

describe('CreatePlanDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar titulo e descricao do dialog', () => {
    render(<CreatePlanDialog {...defaultProps} />)

    expect(
      screen.getByRole('heading', { name: 'Criar plano' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Preencha os dados para criar um novo plano.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar campos do formulario (Nome, Slug, Preco, Ciclo, Descricao)', () => {
    render(<CreatePlanDialog {...defaultProps} />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Slug')).toBeInTheDocument()
    expect(screen.getByLabelText('Preço (centavos)')).toBeInTheDocument()
    expect(screen.getByLabelText('Ciclo')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
  })

  it('deve renderizar opcoes de ciclo (Semanal, Mensal, Anual)', () => {
    render(<CreatePlanDialog {...defaultProps} />)

    expect(screen.getByText('Semanal')).toBeInTheDocument()
    expect(screen.getByText('Mensal')).toBeInTheDocument()
    expect(screen.getByText('Anual')).toBeInTheDocument()
  })

  it('deve renderizar botoes Cancelar e Criar plano', () => {
    render(<CreatePlanDialog {...defaultProps} />)

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Criar plano' }),
    ).toBeInTheDocument()
  })

  it('nao deve renderizar quando open=false', () => {
    render(<CreatePlanDialog {...defaultProps} open={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
