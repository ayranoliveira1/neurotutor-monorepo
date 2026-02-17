import { Module } from '@nestjs/common'
import { AuthProvider } from '@/domain/application/providers/auth-provider'
import { BetterAuthProvider } from '@/infra/auth/auth-provider'

import { CreatePlanUseCase } from '@/domain/application/use-cases/admin/plan/create-plan-use-case'
import { UpdatePlanUseCase } from '@/domain/application/use-cases/admin/plan/update-plan-use-case'
import { DeletePlanUseCase } from '@/domain/application/use-cases/admin/plan/delete-plan-use-case'
import { ListPlansUseCase } from '@/domain/application/use-cases/admin/plan/list-plans-use-case'
import { AdminListPlansUseCase } from '@/domain/application/use-cases/admin/plan/admin-list-plans-use-case'
import { AdminCreateUserUseCase } from '@/domain/application/use-cases/admin/user/admin-create-user-use-case'
import { AdminListUsersUseCase } from '@/domain/application/use-cases/admin/user/admin-list-users-use-case'
import { AdminGetUserByIdUseCase } from '@/domain/application/use-cases/admin/user/admin-get-user-by-id-use-case'
import { AdminUpdateUserUseCase } from '@/domain/application/use-cases/admin/user/admin-update-user-use-case'
import { AdminDeleteUserUseCase } from '@/domain/application/use-cases/admin/user/admin-delete-user-use-case'
import { AdminListRatingsUseCase } from '@/domain/application/use-cases/admin/rating/admin-list-ratings-use-case'
import { AdminDeleteRatingUseCase } from '@/domain/application/use-cases/admin/rating/admin-delete-rating-use-case'
import { CreateNotificationUseCase } from '@/domain/application/use-cases/admin/notification/create-notification-use-case'
import { AdminListNotificationsUseCase } from '@/domain/application/use-cases/admin/notification/admin-list-notifications-use-case'
import { AdminDeleteNotificationUseCase } from '@/domain/application/use-cases/admin/notification/admin-delete-notification-use-case'

import { CreatePlanController } from './plan/create-plan.controller'
import { UpdatePlanController } from './plan/update-plan.controller'
import { DeletePlanController } from './plan/delete-plan.controller'
import { ListPlansController } from './plan/list-plans.controller'
import { AdminListPlansController } from './plan/admin-list-plans.controller'
import { AdminCreateUserController } from './user/admin-create-user.controller'
import { AdminListUsersController } from './user/admin-list-users.controller'
import { AdminGetUserByIdController } from './user/admin-get-user-by-id.controller'
import { AdminUpdateUserController } from './user/admin-update-user.controller'
import { AdminDeleteUserController } from './user/admin-delete-user.controller'
import { AdminListRatingsController } from './rating/admin-list-ratings.controller'
import { AdminDeleteRatingController } from './rating/admin-delete-rating.controller'
import { AdminCreateNotificationController } from './notification/admin-create-notification.controller'
import { AdminListNotificationsController } from './notification/admin-list-notifications.controller'
import { AdminDeleteNotificationController } from './notification/admin-delete-notification.controller'

@Module({
  controllers: [
    CreatePlanController,
    UpdatePlanController,
    DeletePlanController,
    ListPlansController,
    AdminListPlansController,
    AdminCreateUserController,
    AdminListUsersController,
    AdminGetUserByIdController,
    AdminUpdateUserController,
    AdminDeleteUserController,
    AdminListRatingsController,
    AdminDeleteRatingController,
    AdminCreateNotificationController,
    AdminListNotificationsController,
    AdminDeleteNotificationController,
  ],
  providers: [
    { provide: AuthProvider, useClass: BetterAuthProvider },
    CreatePlanUseCase,
    UpdatePlanUseCase,
    DeletePlanUseCase,
    ListPlansUseCase,
    AdminListPlansUseCase,
    AdminCreateUserUseCase,
    AdminListUsersUseCase,
    AdminGetUserByIdUseCase,
    AdminUpdateUserUseCase,
    AdminDeleteUserUseCase,
    AdminListRatingsUseCase,
    AdminDeleteRatingUseCase,
    CreateNotificationUseCase,
    AdminListNotificationsUseCase,
    AdminDeleteNotificationUseCase,
  ],
})
export class AdminModule {}
