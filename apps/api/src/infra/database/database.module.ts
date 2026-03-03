import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { PrismaSubscriptionRepository } from './prisma/repositories/prisma-subscription-repository'
import { subscriptionsRepository } from '@/domain/application/repositories/subscriptions-repository'
import { CheckoutRepository } from '@/domain/application/repositories/checkout-repository'
import { PrismaCheckoutRepository } from './prisma/repositories/prisma-checkout-repository'
import { PlansRepository } from '@/domain/application/repositories/plans-repository'
import { PrismaPlansRepository } from './prisma/repositories/prisma-plans-repository'
import { RatingsRepository } from '@/domain/application/repositories/ratings-repository'
import { PrismaRatingsRepository } from './prisma/repositories/prisma-ratings-repository'
import { NotificationsRepository } from '@/domain/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { PrismaExerciseListsRepository } from './prisma/repositories/prisma-exercise-lists-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { PrismaExerciseAnswersRepository } from './prisma/repositories/prisma-exercise-answers-repository'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { PrismaStudyPlansRepository } from './prisma/repositories/prisma-study-plans-repository'
import { StudyPlanGoalProgressRepository } from '@/domain/application/repositories/study-plan-goal-progress-repository'
import { PrismaStudyPlanGoalProgressRepository } from './prisma/repositories/prisma-study-plan-goal-progress-repository'
import { FocusedStudySessionsRepository } from '@/domain/application/repositories/focused-study-sessions-repository'
import { PrismaFocusedStudySessionsRepository } from './prisma/repositories/prisma-focused-study-sessions-repository'

@Global()
@Module({
  providers: [
    PrismaService,

    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    },

    {
      provide: subscriptionsRepository,
      useClass: PrismaSubscriptionRepository
    },

    {
      provide: CheckoutRepository,
      useClass: PrismaCheckoutRepository
    },

    {
      provide: PlansRepository,
      useClass: PrismaPlansRepository
    },

    {
      provide: RatingsRepository,
      useClass: PrismaRatingsRepository
    },

    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository
    },

    {
      provide: ExerciseListsRepository,
      useClass: PrismaExerciseListsRepository
    },

    {
      provide: ExerciseAnswersRepository,
      useClass: PrismaExerciseAnswersRepository
    },

    {
      provide: StudyPlansRepository,
      useClass: PrismaStudyPlansRepository
    },

    {
      provide: StudyPlanGoalProgressRepository,
      useClass: PrismaStudyPlanGoalProgressRepository
    },

    {
      provide: FocusedStudySessionsRepository,
      useClass: PrismaFocusedStudySessionsRepository
    },
  ],
  exports: [
    PrismaService,
    subscriptionsRepository,
    UsersRepository,
    CheckoutRepository,
    PlansRepository,
    RatingsRepository,
    NotificationsRepository,
    ExerciseListsRepository,
    ExerciseAnswersRepository,
    StudyPlansRepository,
    StudyPlanGoalProgressRepository,
    FocusedStudySessionsRepository,
  ],
})
export class DatabaseModule { }
