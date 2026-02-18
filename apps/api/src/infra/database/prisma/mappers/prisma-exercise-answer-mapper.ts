import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

export class ExerciseAnswerMapper {
  static toDomain(raw: any): ExerciseAnswer {
    return ExerciseAnswer.create(
      {
        exerciseListId: new UniqueEntityID(raw.exerciseListId),
        questionId: raw.questionId,
        selectedAnswer: raw.selectedAnswer,
        isCorrect: raw.isCorrect,
        timeSpentSeconds: raw.timeSpentSeconds ?? 0,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(answer: ExerciseAnswer) {
    return {
      id: answer.id.toValue(),
      exerciseListId: answer.exerciseListId.toValue(),
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      timeSpentSeconds: answer.timeSpentSeconds,
      createdAt: answer.createdAt,
    }
  }
}
