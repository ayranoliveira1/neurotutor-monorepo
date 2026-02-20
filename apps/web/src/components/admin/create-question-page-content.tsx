'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAction } from 'next-safe-action/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminCreateQuestionFormSchema } from '@/schemas/question'
import { createQuestionAction } from '@/actions/admin/create-question'
import { ImageUrlPreview } from './image-url-preview'

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export function CreateQuestionPageContent() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(adminCreateQuestionFormSchema),
    defaultValues: {
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

  const { execute, result, isPending } = useAction(createQuestionAction, {
    onSuccess: () => {
      toast.success('Questão criada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] })
      router.push('/admin/questoes')
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao criar questão')
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    execute(data)
  })

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = form

  const watchedImageUrl = watch('imageUrl')
  const watchedCategories = watch('categories') as string[]
  const [categoryInput, setCategoryInput] = useState('')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'alternatives' as never,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/questoes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para questões
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Questão</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="q-external-id">ID Externo</Label>
                <Input
                  id="q-external-id"
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
                <Label htmlFor="q-origin">Origem</Label>
                <Input
                  id="q-origin"
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
              <Label htmlFor="q-statement">Enunciado</Label>
              <textarea
                id="q-statement"
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
              <Label htmlFor="q-image-url">URL da Imagem (opcional)</Label>
              <Input
                id="q-image-url"
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
                <Label htmlFor="q-subject">Disciplina</Label>
                <Input
                  id="q-subject"
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
                <Label htmlFor="q-difficulty">Dificuldade</Label>
                <select
                  id="q-difficulty"
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
                <Label htmlFor="q-year">Ano (opcional)</Label>
                <Input
                  id="q-year"
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
                <Label htmlFor="q-correct-answer">
                  Resposta Correta (índice)
                </Label>
                <Input
                  id="q-correct-answer"
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
                    (errors.alternatives as Record<string, unknown>).message ??
                      (
                        errors.alternatives as {
                          root?: { message?: string }
                        }
                      ).root?.message ??
                      '',
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
                onClick={() => router.push('/admin/questoes')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar questão'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
