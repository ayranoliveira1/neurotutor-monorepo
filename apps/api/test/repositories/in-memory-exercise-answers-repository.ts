import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

export class InMemoryExerciseAnswersRepository
  implements ExerciseAnswersRepository
{
  public items: ExerciseAnswer[] = []

  async createOrUpdate(answer: ExerciseAnswer): Promise<void> {
    const index = this.items.findIndex(
      (i) =>
        i.exerciseListId.toString() === answer.exerciseListId.toString() &&
        i.questionId === answer.questionId,
    )

    if (index >= 0) {
      this.items[index] = answer
    } else {
      this.items.push(answer)
    }
  }

  async findByListAndQuestion(
    exerciseListId: string,
    questionId: string,
  ): Promise<ExerciseAnswer | null> {
    const item = this.items.find(
      (i) =>
        i.exerciseListId.toString() === exerciseListId &&
        i.questionId === questionId,
    )
    return item ?? null
  }

  async findManyByListId(exerciseListId: string): Promise<ExerciseAnswer[]> {
    return this.items.filter(
      (i) => i.exerciseListId.toString() === exerciseListId,
    )
  }

  async countByListId(exerciseListId: string): Promise<number> {
    return this.items.filter(
      (i) => i.exerciseListId.toString() === exerciseListId,
    ).length
  }

  async saveManyIsCorrect(answers: ExerciseAnswer[]): Promise<void> {
    for (const answer of answers) {
      const index = this.items.findIndex(
        (i) => i.id.toString() === answer.id.toString(),
      )
      if (index >= 0) {
        this.items[index] = answer
      }
    }
  }
}
