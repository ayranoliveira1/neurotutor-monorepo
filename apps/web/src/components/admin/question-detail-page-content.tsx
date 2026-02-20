'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAction } from 'next-safe-action/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuestionDetailQuery } from '@/hooks/admin/use-question-detail-query'
import { updateQuestionAction } from '@/actions/admin/update-question'
import { adminUpdateQuestionFormSchema } from '@/schemas/question'
import { DeleteQuestionDialog } from './delete-question-dialog'
import { ImageUrlPreview } from './image-url-preview'

interface QuestionDetailPageContentProps {
  questionId: string
}

const difficultyConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  EASY: { label: 'Fácil', variant: 'default' },
  MEDIUM: { label: 'Médio', variant: 'secondary' },
  HARD: { label: 'Difícil', variant: 'destructive' },
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export function QuestionDetailPageContent({
  questionId,
}: QuestionDetailPageContentProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const query = useQuestionDetailQuery(questionId)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(adminUpdateQuestionFormSchema),
    defaultValues: {
      id: '',
      externalId: '',
      statement: '',
      imageUrl: '',
      alternatives: [{ value: '' }, { value: '' }],
      origin: '',
      subject: '',
      categories: [] as string[],
      correctAnswer: 0,
      year: undefined as number | undefined,
      difficulty: '',
    },
  })

  const { execute, result, isPending } = useAction(updateQuestionAction, {
    onSuccess: () => {
      toast.success('Questão atualizada com sucesso')
      queryClient.invalidateQueries({
        queryKey: ['admin', 'questions'],
      })
      setIsEditing(false)
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao atualizar questão')
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    execute(data)
  })

  const {
    register,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form

  const watchedImageUrl = useWatch({ control, name: 'imageUrl' }) as string
  const watchedCategories = watch('categories') as string[]
  const [categoryInput, setCategoryInput] = useState('')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'alternatives' as never,
  })

  const question = query.data

  useEffect(() => {
    if (question && isEditing) {
      const alternatives = Array.isArray(question.alternatives)
        ? (question.alternatives as string[]).map((alt: string) => ({
            value: typeof alt === 'string' ? alt : String(alt),
          }))
        : [{ value: '' }, { value: '' }]

      reset({
        id: question.id,
        externalId: question.externalId,
        statement: question.statement,
        imageUrl: question.imageUrl ?? '',
        alternatives: alternatives as never[],
        origin: question.origin,
        subject: question.subject,
        categories: question.categories ?? [],
        correctAnswer: question.correctAnswer,
        year: question.year ?? undefined,
        difficulty: question.difficulty ?? '',
      })
    }
  }, [question, isEditing, reset])

  if (query.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Carregando questão...
      </div>
    )
  }

  if (query.isError) {
    const message =
      query.error instanceof Error ? query.error.message : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/questoes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para questões
        </Button>
      </div>
    )
  }

  if (!question) return null

  const diff = question.difficulty
    ? difficultyConfig[question.difficulty]
    : null

  const alternatives = Array.isArray(question.alternatives)
    ? (question.alternatives as string[])
    : []

  function handleCancelEdit() {
    setIsEditing(false)
    reset()
  }

  function handleDeleteSuccess() {
    toast.success('Questão excluída com sucesso')
    queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] })
    router.push('/admin/questoes')
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar edição
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Questão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <input type="hidden" {...register('id')} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-external-id">ID Externo</Label>
                  <Input
                    id="edit-external-id"
                    placeholder="Ex: ENEM-2025-001"
                    {...register('externalId')}
                  />
                  {errors.externalId && (
                    <p className="text-sm text-destructive">
                      {errors.externalId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-origin">Origem</Label>
                  <Input
                    id="edit-origin"
                    placeholder="Ex: ENEM"
                    {...register('origin')}
                  />
                  {errors.origin && (
                    <p className="text-sm text-destructive">
                      {errors.origin.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-statement">Enunciado</Label>
                <textarea
                  id="edit-statement"
                  rows={6}
                  placeholder="Digite o enunciado da questão"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('statement')}
                />
                {errors.statement && (
                  <p className="text-sm text-destructive">
                    {errors.statement.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image-url">URL da Imagem (opcional)</Label>
                <Input
                  id="edit-image-url"
                  placeholder="https://..."
                  {...register('imageUrl')}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">
                    {errors.imageUrl.message}
                  </p>
                )}
                <ImageUrlPreview url={watchedImageUrl} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Disciplina</Label>
                  <Input
                    id="edit-subject"
                    placeholder="Ex: Matemática"
                    {...register('subject')}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">Dificuldade</Label>
                  <select
                    id="edit-difficulty"
                    {...register('difficulty')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Selecione (opcional)</option>
                    <option value="EASY">Fácil</option>
                    <option value="MEDIUM">Médio</option>
                    <option value="HARD">Difícil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Ano (opcional)</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    placeholder="Ex: 2025"
                    {...register('year')}
                  />
                  {errors.year && (
                    <p className="text-sm text-destructive">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-correct-answer">
                    Resposta Correta (índice)
                  </Label>
                  <Input
                    id="edit-correct-answer"
                    type="number"
                    min={0}
                    placeholder="0"
                    {...register('correctAnswer')}
                  />
                  {errors.correctAnswer && (
                    <p className="text-sm text-destructive">
                      {errors.correctAnswer.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Alternativas</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: '' } as never)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Adicionar
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                      {letters[index] ?? index}
                    </span>
                    <Input
                      placeholder={`Alternativa ${letters[index] ?? index}`}
                      {...register(`alternatives.${index}.value` as never)}
                    />
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.alternatives && (
                  <p className="text-sm text-destructive">
                    {String(
                      (errors.alternatives as Record<string, unknown>)
                        .message ??
                        (
                          errors.alternatives as {
                            root?: { message?: string }
                          }
                        ).root?.message ??
                        ''
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Categorias</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Digite uma categoria e pressione Enter"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        const value = categoryInput.trim()
                        if (value && !watchedCategories.includes(value)) {
                          setValue('categories', [...watchedCategories, value])
                        }
                        setCategoryInput('')
                      }
                    }}
                  />
                </div>
                {watchedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {watchedCategories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              'categories',
                              watchedCategories.filter((c) => c !== cat),
                            )
                          }
                          className="rounded-full p-0.5 hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {result?.serverError && (
                <p className="text-sm text-destructive">
                  {result.serverError}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar alterações'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/questoes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para questões
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">ID Externo</p>
              <p className="font-mono text-sm">{question.externalId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="text-sm">{question.origin}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Disciplina</p>
              <p className="text-sm">{question.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ano</p>
              <p className="text-sm">{question.year ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dificuldade</p>
              {diff ? (
                <Badge variant={diff.variant}>{diff.label}</Badge>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resposta Correta</p>
              <p className="text-sm font-medium">
                {letters[question.correctAnswer] ?? question.correctAnswer}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enunciado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {question.statement}
          </p>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Imagem da questão"
              className="mt-4 max-h-64 rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alternativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alternatives.map((alt, index) => {
              const isCorrect = index === question.correctAnswer
              const text = typeof alt === 'string' ? alt : String(alt)

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
                    isCorrect ? 'border-green-500/50 bg-green-500/10' : ''
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      letters[index]
                    )}
                  </span>
                  <span className="text-sm">{text}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {question.categories && question.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {question.categories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Metadados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Criado em</p>
              <p className="text-sm">
                {new Date(question.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Atualizado em</p>
              <p className="text-sm">
                {new Date(question.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteQuestionDialog
        questionId={question.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
