import { Badge } from '@/components/ui/badge'
import type { ExerciseListSection } from '@/actions/exercise-list/types'

interface SubjectBadgesProps {
  sections: ExerciseListSection[]
  max?: number
}

export function SubjectBadges({ sections, max = 2 }: SubjectBadgesProps) {
  const subjects = [...new Set(sections.map((s) => s.subject))]
  if (subjects.length === 0) return null

  const visible = subjects.slice(0, max)
  const extra = subjects.length - max

  return (
    <>
      {visible.map((subject) => (
        <Badge
          key={subject}
          variant="secondary"
          className="text-[10px] font-normal"
        >
          {subject}
        </Badge>
      ))}
      {extra > 0 && (
        <Badge variant="secondary" className="text-[10px] font-normal">
          +{extra}
        </Badge>
      )}
    </>
  )
}
