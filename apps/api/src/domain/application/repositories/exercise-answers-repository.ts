import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

export abstract class ExerciseAnswersRepository {
  abstract createOrUpdate(answer: ExerciseAnswer): Promise<void>
  abstract findByListAndQuestion(
    exerciseListId: string,
    questionId: string,
  ): Promise<ExerciseAnswer | null>
  abstract findManyByListId(exerciseListId: string): Promise<ExerciseAnswer[]>
  abstract countByListId(exerciseListId: string): Promise<number>
  abstract saveManyIsCorrect(answers: ExerciseAnswer[]): Promise<void>
  abstract findAnsweredQuestionIdsByUserId(userId: string): Promise<string[]>
  abstract countByUserAndSubjectsInDateRange(
    userId: string,
    subjects: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, number>>
}
