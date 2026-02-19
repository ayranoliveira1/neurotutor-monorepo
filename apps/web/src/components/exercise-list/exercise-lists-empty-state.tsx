'use client'

import { motion } from 'framer-motion'
import { BookOpen, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExerciseListsEmptyStateProps {
  hasActiveFilters: boolean
  onCreateNew: () => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
} as const

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

const iconEntry = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 12 },
  },
}

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
}

export function ExerciseListsEmptyState({
  hasActiveFilters,
  onCreateNew,
}: ExerciseListsEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 px-6 text-center"
      >
        <motion.div
          variants={iconEntry}
          animate={floatAnimation}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-muted"
        >
          <Search className="h-7 w-7 text-muted-foreground" />
        </motion.div>

        <motion.h3
          variants={item}
          className="text-lg font-semibold tracking-tight"
        >
          Nenhum resultado encontrado
        </motion.h3>

        <motion.p
          variants={item}
          className="max-w-sm text-sm text-muted-foreground"
        >
          Tente ajustar os filtros para encontrar o que procura.
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-20 px-6 text-center"
    >
      <motion.div
        variants={iconEntry}
        animate={floatAnimation}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        <BookOpen className="h-8 w-8 text-primary" />
      </motion.div>

      <div className="space-y-1.5">
        <motion.h3
          variants={item}
          className="text-lg font-semibold tracking-tight"
        >
          Comece sua jornada de estudos!
        </motion.h3>

        <motion.p
          variants={item}
          className="max-w-sm text-sm text-muted-foreground"
        >
          Crie sua primeira lista de exercícios e acompanhe sua evolução a cada
          questão resolvida.
        </motion.p>
      </div>

      <motion.div variants={item}>
        <Button onClick={onCreateNew} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Criar primeira lista
        </Button>
      </motion.div>
    </motion.div>
  )
}
