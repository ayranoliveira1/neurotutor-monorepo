import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { InMemoryExerciseListsRepository } from './in-memory-exercise-lists-repository'

export class InMemoryExerciseAnswersRepository
  implements ExerciseAnswersRepository
{
  public items: ExerciseAnswer[] = []

  constructor(
    private exerciseListsRepository?: InMemoryExerciseListsRepository,
  ) {}

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

  async findAnsweredQuestionIdsByUserId(userId: string): Promise<string[]> {
    const userListIds = (this.exerciseListsRepository?.items ?? [])
      .filter((list) => list.userId.toString() === userId)
      .map((list) => list.id.toString())

    const questionIds = this.items
      .filter((answer) =>
        userListIds.includes(answer.exerciseListId.toString()),
      )
      .map((answer) => answer.questionId)

    return [...new Set(questionIds)]
  }

  async countByUserAndSubjectsInDateRange(
    userId: string,
    subjects: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>()

    const userLists = (this.exerciseListsRepository?.items ?? []).filter(
      (list) =>
        list.userId.toString() === userId &&
        list.status === 'FINISHED' &&
        list.createdAt >= startDate &&
        list.createdAt <= endDate,
    )

    for (const list of userLists) {
      const listAnswers = this.items.filter(
        (a) => a.exerciseListId.toString() === list.id.toString(),
      )

      for (const answer of listAnswers) {
        const subject = list.questionSubjectMap[answer.questionId]
        if (subject && subjects.includes(subject)) {
          result.set(subject, (result.get(subject) ?? 0) + 1)
        }
      }
    }

    return result
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
