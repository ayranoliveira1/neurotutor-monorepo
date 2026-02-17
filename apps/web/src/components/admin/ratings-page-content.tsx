'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import type { AdminRating } from '@/actions/admin/list-ratings'
import { useRatingsQuery } from '@/hooks/admin/use-ratings-query'
import { RatingsTable } from './ratings-table'
import { RatingsPagination } from './ratings-pagination'
import { DeleteRatingDialog } from './delete-rating-dialog'
import { RatingsPageSkeleton } from './ratings-page-skeleton'

export function RatingsPageContent() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') ?? '1')
  const perPage = 10

  const ratingsQuery = useRatingsQuery({ page, perPage })

  const [deleteRating, setDeleteRating] = useState<AdminRating | null>(null)

  function handleDeleteSuccess() {
    toast.success('Avaliação excluída com sucesso')
    queryClient.invalidateQueries({ queryKey: ['admin', 'ratings'] })
  }

  if (ratingsQuery.isLoading) {
    return <RatingsPageSkeleton />
  }

  if (ratingsQuery.isError) {
    const message =
      ratingsQuery.error instanceof Error
        ? ratingsQuery.error.message
        : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
    )
  }

  const data = ratingsQuery.data!

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Avaliações</h2>
        <p className="text-muted-foreground">
          Veja as avaliações dos usuários sobre a plataforma.
        </p>
      </div>

      <RatingsTable ratings={data.ratings} onDelete={setDeleteRating} />

      {data.totalPages > 1 && (
        <RatingsPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
        />
      )}

      <DeleteRatingDialog
        rating={deleteRating}
        open={!!deleteRating}
        onOpenChange={(open) => !open && setDeleteRating(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
