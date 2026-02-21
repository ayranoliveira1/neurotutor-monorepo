'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Star, Trash2, Mail, Calendar } from 'lucide-react'
import type { AdminRating } from '@/actions/admin/avaliacoes/list-ratings'

interface RatingsTableProps {
  ratings: AdminRating[]
  onDelete: (rating: AdminRating) => void
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= value
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          }
        />
      ))}
    </div>
  )
}

export function RatingsTable({ ratings, onDelete }: RatingsTableProps) {
  if (ratings.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border text-muted-foreground">
        Nenhuma avaliação encontrada.
      </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.map((rating) => (
              <TableRow key={rating.id}>
                <TableCell className="font-medium">{rating.userName}</TableCell>
                <TableCell>{rating.userEmail}</TableCell>
                <TableCell>
                  <StarDisplay value={rating.rating} />
                </TableCell>
                <TableCell className="max-w-75 truncate">
                  {rating.description}
                </TableCell>
                <TableCell>
                  {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(rating)}
                    aria-label="Excluir avaliação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{rating.userName}</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{rating.userEmail}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(rating)}
                aria-label="Excluir avaliação"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-3">
              <StarDisplay value={rating.rating} />
            </div>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {rating.description}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
