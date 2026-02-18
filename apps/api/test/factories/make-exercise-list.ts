import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ExerciseList,
  ExerciseListProps,
} from '@/domain/entreprise/entities/exercise-list'
import { faker } from '@faker-js/faker'

export function MakeExerciseList(
  override: Partial<ExerciseListProps> = {},
  id?: UniqueEntityID,
) {
  return ExerciseList.create(
    {
      userId: override.userId ?? new UniqueEntityID(),
      name: override.name ?? faker.lorem.words(3),
      sections: override.sections ?? [
        { subject: 'Matemática', quantity: 5 },
      ],
      questionIds: override.questionIds ?? Array.from({ length: 5 }, () =>
        faker.string.uuid(),
      ),
      totalQuestions: override.totalQuestions ?? 5,
      ...override,
    },
    id,
  )
}
