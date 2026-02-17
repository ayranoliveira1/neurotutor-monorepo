import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/entreprise/entities/notification'
import { faker } from '@faker-js/faker'

export function MakeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      destination: {
        sendIds: [
          {
            userId: faker.string.uuid(),
            readAt: undefined,
          },
        ],
      },
      createdAt: new Date(),
      ...override,
    },
    id,
  )
  return notification
}
