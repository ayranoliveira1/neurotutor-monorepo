import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateQuestionPageContent } from '../create-question-page-content'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}))

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

vi.mock('@/actions/admin/create-question', () => ({
  createQuestionAction: vi.fn(),
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
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'reset' | 'submit'
  }) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    htmlFor?: string
  }) => <label {...props}>{children}</label>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

vi.mock('../image-url-preview', () => ({
  ImageUrlPreview: ({ url }: { url: string | undefined }) =>
    url ? <div data-testid="image-preview">{url}</div> : null,
}))

describe('CreateQuestionPageContent', () => {
  it('deve renderizar título da página', () => {
    render(<CreateQuestionPageContent />)
    expect(screen.getByText('Criar Questão')).toBeInTheDocument()
  })

  it('deve renderizar botão voltar', () => {
    render(<CreateQuestionPageContent />)
    expect(
      screen.getByText('Voltar para questões'),
    ).toBeInTheDocument()
  })

  it('deve renderizar campos do formulário', () => {
    render(<CreateQuestionPageContent />)
    expect(screen.getByLabelText('ID Externo')).toBeInTheDocument()
    expect(screen.getByLabelText('Origem')).toBeInTheDocument()
    expect(screen.getByLabelText('Enunciado')).toBeInTheDocument()
    expect(
      screen.getByLabelText('URL da Imagem (opcional)'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Disciplina')).toBeInTheDocument()
    expect(screen.getByLabelText('Dificuldade')).toBeInTheDocument()
    expect(screen.getByLabelText('Ano (opcional)')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Resposta Correta (índice)'),
    ).toBeInTheDocument()
  })

  it('deve renderizar alternativas iniciais (A e B)', () => {
    render(<CreateQuestionPageContent />)
    expect(
      screen.getByPlaceholderText('Alternativa A'),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Alternativa B'),
    ).toBeInTheDocument()
  })

  it('deve adicionar alternativa ao clicar em Adicionar', async () => {
    const user = userEvent.setup()
    render(<CreateQuestionPageContent />)

    expect(
      screen.queryByPlaceholderText('Alternativa C'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByText('Adicionar'))

    expect(
      screen.getByPlaceholderText('Alternativa C'),
    ).toBeInTheDocument()
  })

  it('deve renderizar botões de ação', () => {
    render(<CreateQuestionPageContent />)
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(screen.getByText('Criar questão')).toBeInTheDocument()
  })

  it('deve renderizar campo de categorias', () => {
    render(<CreateQuestionPageContent />)
    expect(
      screen.getByPlaceholderText(
        'Digite uma categoria e pressione Enter',
      ),
    ).toBeInTheDocument()
  })
})
