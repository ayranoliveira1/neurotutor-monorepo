'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StudyPlansPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function StudyPlansPagination({
  currentPage,
  totalPages,
  totalItems,
}: StudyPlansPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {totalItems} plano{totalItems !== 1 ? 's' : ''} encontrado
        {totalItems !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
