import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

export class ExerciseAnswerPresenter {
  static toHTTP(answer: ExerciseAnswer) {
    return {
      id: answer.id.toString(),
      exerciseListId: answer.exerciseListId.toString(),
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      timeSpentSeconds: answer.timeSpentSeconds,
      createdAt: answer.createdAt,
    }
  }
}
