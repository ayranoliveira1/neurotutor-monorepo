'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { StarRating } from './star-rating'
import { getUserRating } from '@/actions/rating/get-user-rating'
import { createRatingAction } from '@/actions/rating/create-rating'
import { toast } from 'sonner'

const INITIAL_DELAY_MS = 3_000
const REOPEN_DELAY_MS = 600_000

interface RatingPopupProps {
  userId: string
}

export function RatingPopup({ userId }: RatingPopupProps) {
  const [hasRated, setHasRated] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { execute, isPending } = useAction(createRatingAction, {
    onSuccess: () => {
      setHasRated(true)
      setOpen(false)
      resetForm()
      toast.success('Avaliação enviada com sucesso!')
    },
    onError: ({ error }) => {
      toast.error(
        error?.serverError ?? 'Erro ao enviar avaliação. Tente novamente.'
      )
    },
  })

  const resetForm = useCallback(() => {
    setRating(0)
    setDescription('')
    setError('')
  }, [])

  const startTimer = useCallback((delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setOpen(true)
    }, delay)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function checkRating() {
      const userRating = await getUserRating()
      if (cancelled) return

      if (userRating) {
        setHasRated(true)
      } else {
        setHasRated(false)
        startTimer(INITIAL_DELAY_MS)
      }
    }

    checkRating()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [userId, startTimer])

  function handleClose() {
    setOpen(false)
    if (!hasRated) {
      resetForm()
      startTimer(REOPEN_DELAY_MS)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Selecione uma avaliação')
      return
    }

    execute({ rating, description: description.trim() })
  }

  if (hasRated === null || hasRated) return null

  return (
    <div
      data-testid="rating-popup"
      aria-hidden={!open}
      className={cn(
        'fixed z-50 border border-primary bg-primary text-primary-foreground shadow-lg',
        'transition-all duration-300 ease-in-out',
        'inset-x-0 bottom-0 w-full rounded-t-xl p-4',
        'sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-95 sm:rounded-lg sm:p-6',
        open
          ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
          : 'pointer-events-none translate-y-full sm:translate-y-0 sm:translate-x-[calc(100%+2rem)] opacity-0'
      )}
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-primary-foreground/30 sm:hidden" />

      <button
        type="button"
        onClick={handleClose}
        className="absolute cursor-pointer top-3 right-3 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-3 sm:mb-4">
        <h3 className="text-base font-semibold sm:text-lg">
          Avalie a plataforma
        </h3>
        <p className="text-sm text-primary-foreground/80">
          Sua opinião é muito importante para nós!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label>Sua avaliação</Label>
          <StarRating
            value={rating}
            onChange={setRating}
            size={28}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating-description">Descrição (opcional)</Label>
          <textarea
            id="rating-description"
            className="flex min-h-16 w-full rounded-md border border-primary-foreground/20! bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/30 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-20"
            placeholder="Conte como está sendo sua experiência..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
        </div>

        {error && <p className="text-sm font-medium text-red-200">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-primary-foreground/30! bg-transparent text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
          >
            Agora não
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar avaliação'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
