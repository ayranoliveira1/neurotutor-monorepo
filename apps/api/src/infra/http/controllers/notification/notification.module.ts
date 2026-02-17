import { Module } from '@nestjs/common'
import { FetchUserNotificationsController } from './fetch-user-notifications.controller'
import { ReadAllNotificationsController } from './read-all-notifications.controller'
import { ReadNotificationController } from './read-notification.controller'
import { DeleteNotificationController } from './delete-notification.controller'
import { FetchUserNotificationsUseCase } from '@/domain/application/use-cases/notification/fetch-user-notifications-use-case'
import { ReadAllNotificationsUseCase } from '@/domain/application/use-cases/notification/read-all-notifications-use-case'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/notification/read-notification-use-case'
import { DeleteNotificationUseCase } from '@/domain/application/use-cases/notification/delete-notification-use-case'

@Module({
  controllers: [
    FetchUserNotificationsController,
    ReadAllNotificationsController,
    ReadNotificationController,
    DeleteNotificationController,
  ],
  providers: [
    FetchUserNotificationsUseCase,
    ReadAllNotificationsUseCase,
    ReadNotificationUseCase,
    DeleteNotificationUseCase,
  ],
})
export class NotificationModule {}
