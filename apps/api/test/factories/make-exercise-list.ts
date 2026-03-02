import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ExerciseList,
  ExerciseListProps,
  type ExerciseListSection,
} from '@/domain/entreprise/entities/exercise-list'
import { faker } from '@faker-js/faker'

function buildQuestionSubjectMap(
  sections: ExerciseListSection[],
  questionIds: string[],
): Record<string, string> {
  const map: Record<string, string> = {}
  let offset = 0
  for (const section of sections) {
    for (
      let i = 0;
      i < section.quantity && offset + i < questionIds.length;
      i++
    ) {
      map[questionIds[offset + i]] = section.subject
    }
    offset += section.quantity
  }
  return map
}

export function MakeExerciseList(
  override: Partial<ExerciseListProps> = {},
  id?: UniqueEntityID,
) {
  const sections = override.sections ?? [
    { subject: 'Matemática', quantity: 5 },
  ]
  const questionIds =
    override.questionIds ??
    Array.from({ length: 5 }, () => faker.string.uuid())

  const questionSubjectMap =
    override.questionSubjectMap ??
    buildQuestionSubjectMap(sections, questionIds)

  return ExerciseList.create(
    {
      userId: override.userId ?? new UniqueEntityID(),
      name: override.name ?? faker.lorem.words(3),
      sections,
      questionIds,
      questionSubjectMap,
      totalQuestions: override.totalQuestions ?? 5,
      ...override,
    },
    id,
  )
}
