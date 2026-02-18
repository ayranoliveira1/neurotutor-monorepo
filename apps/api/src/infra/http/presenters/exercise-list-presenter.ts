import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'

export class ExerciseListPresenter {
  static toHTTP(exerciseList: ExerciseList) {
    return {
      id: exerciseList.id.toString(),
      name: exerciseList.name,
      shuffleQuestions: exerciseList.shuffleQuestions,
      ignoreAnswered: exerciseList.ignoreAnswered,
      sections: exerciseList.sections,
      totalQuestions: exerciseList.totalQuestions,
      status: exerciseList.status,
      correctCount: exerciseList.correctCount,
      totalTimeSeconds: exerciseList.totalTimeSeconds,
      avgTimePerQuestion: exerciseList.avgTimePerQuestion,
      createdAt: exerciseList.createdAt,
      updatedAt: exerciseList.updatedAt,
    }
  }
}
