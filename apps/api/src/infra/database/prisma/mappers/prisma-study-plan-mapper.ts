import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  StudyPlan,
  StudyPlanStatus,
} from '@/domain/entreprise/entities/study-plan'
import { StudyPlanGoalMapper } from './prisma-study-plan-goal-mapper'

export class StudyPlanMapper {
  static toDomain(raw: any): StudyPlan {
    return StudyPlan.create(
      {
        userId: new UniqueEntityID(raw.userId),
        name: raw.name,
        description: raw.description ?? null,
        status: raw.status as StudyPlanStatus,
        startDate: raw.startDate,
        endDate: raw.endDate,
        goals: raw.goals
          ? raw.goals.map(StudyPlanGoalMapper.toDomain)
          : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(studyPlan: StudyPlan) {
    return {
      id: studyPlan.id.toValue(),
      userId: studyPlan.userId.toValue(),
      name: studyPlan.name,
      description: studyPlan.description,
      status: studyPlan.status,
      startDate: studyPlan.startDate,
      endDate: studyPlan.endDate,
      createdAt: studyPlan.createdAt,
      updatedAt: studyPlan.updatedAt,
    }
  }
}
