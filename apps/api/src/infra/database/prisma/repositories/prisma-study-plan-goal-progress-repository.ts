import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { StudyPlanGoalProgressRepository } from '@/domain/application/repositories/study-plan-goal-progress-repository'
import { StudyPlanGoalProgress } from '@/domain/entreprise/entities/study-plan-goal-progress'
import { StudyPlanGoalProgressMapper } from '../mappers/prisma-study-plan-goal-progress-mapper'

@Injectable()
export class PrismaStudyPlanGoalProgressRepository
  implements StudyPlanGoalProgressRepository
{
  constructor(private prisma: PrismaService) {}

  async findByStudyPlanId(
    studyPlanId: string,
  ): Promise<StudyPlanGoalProgress[]> {
    const items = await this.prisma.studyPlanGoalProgress.findMany({
      where: { studyPlanId },
    })

    return items.map(StudyPlanGoalProgressMapper.toDomain)
  }

  async findByStudyPlanAndSubject(
    studyPlanId: string,
    subject: string,
  ): Promise<StudyPlanGoalProgress | null> {
    const item = await this.prisma.studyPlanGoalProgress.findUnique({
      where: { studyPlanId_subject: { studyPlanId, subject } },
    })

    if (!item) return null

    return StudyPlanGoalProgressMapper.toDomain(item)
  }

  async save(progress: StudyPlanGoalProgress): Promise<void> {
    const data = StudyPlanGoalProgressMapper.toPrisma(progress)
    await this.prisma.studyPlanGoalProgress.update({
      where: { id: data.id },
      data,
    })
  }

  async createOrUpdate(progress: StudyPlanGoalProgress): Promise<void> {
    const data = StudyPlanGoalProgressMapper.toPrisma(progress)
    await this.prisma.studyPlanGoalProgress.upsert({
      where: {
        studyPlanId_subject: {
          studyPlanId: data.studyPlanId,
          subject: data.subject,
        },
      },
      create: data,
      update: {
        totalAnswered: data.totalAnswered,
        correctCount: data.correctCount,
      },
    })
  }

  async createMany(items: StudyPlanGoalProgress[]): Promise<void> {
    const data = items.map(StudyPlanGoalProgressMapper.toPrisma)
    await this.prisma.studyPlanGoalProgress.createMany({ data })
  }
}
