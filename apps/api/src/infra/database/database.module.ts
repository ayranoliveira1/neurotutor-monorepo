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
  ],
  exports: [
    PrismaService,
    subscriptionsRepository,
    UsersRepository,
    CheckoutRepository,
    PlansRepository,
    RatingsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule { }
