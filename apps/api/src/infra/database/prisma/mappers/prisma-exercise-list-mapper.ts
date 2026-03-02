import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ExerciseList,
  ExerciseListStatus,
  type ExerciseListSection,
} from '@/domain/entreprise/entities/exercise-list'
import { Prisma } from '@/infra/generated/prisma/edge'

export class ExerciseListMapper {
  static toDomain(raw: any): ExerciseList {
    return ExerciseList.create(
      {
        userId: new UniqueEntityID(raw.userId),
        name: raw.name,
        shuffleQuestions: raw.shuffleQuestions,
        ignoreAnswered: raw.ignoreAnswered,
        sections: raw.sections as ExerciseListSection[],
        questionIds: raw.questionIds as string[],
        questionSubjectMap:
          (raw.questionSubjectMap as Record<string, string>) ?? {},
        totalQuestions: raw.totalQuestions,
        status: raw.status as ExerciseListStatus,
        correctCount: raw.correctCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(exerciseList: ExerciseList) {
    return {
      id: exerciseList.id.toValue(),
      userId: exerciseList.userId.toValue(),
      name: exerciseList.name,
      shuffleQuestions: exerciseList.shuffleQuestions,
      ignoreAnswered: exerciseList.ignoreAnswered,
      sections: exerciseList.sections as unknown as Prisma.InputJsonValue,
      questionIds: exerciseList.questionIds as unknown as Prisma.InputJsonValue,
      questionSubjectMap:
        exerciseList.questionSubjectMap as unknown as Prisma.InputJsonValue,
      totalQuestions: exerciseList.totalQuestions,
      status: exerciseList.status,
      correctCount: exerciseList.correctCount,
      createdAt: exerciseList.createdAt,
      updatedAt: exerciseList.updatedAt,
    }
  }
}
