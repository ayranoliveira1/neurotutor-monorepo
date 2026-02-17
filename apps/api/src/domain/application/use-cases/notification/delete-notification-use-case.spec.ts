import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { MakeNotification } from '@test/factories/make-notification'
import { DeleteNotificationUseCase } from './delete-notification-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: DeleteNotificationUseCase

describe('Delete Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new DeleteNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should remove user from sendIds when there are other recipients', async () => {
    const userId = 'user-1'
    const notification = MakeNotification({
      destination: {
        sendIds: [
          { userId, readAt: undefined },
          { userId: 'user-2', readAt: undefined },
        ],
      },
    })
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      userId,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)

    const updated = inMemoryNotificationsRepository.items[0]
    expect(updated.destination.sendIds).toHaveLength(1)
    expect(updated.destination.sendIds[0].userId).toBe('user-2')
  })

  it('should delete notification entirely when last recipient removes', async () => {
    const userId = 'user-1'
    const notification = MakeNotification({
      destination: {
        sendIds: [{ userId, readAt: undefined }],
      },
    })
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      userId,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(0)
  })

  it('should return error if notification does not exist', async () => {
    const result = await sut.execute({
      notificationId: 'non-existent-id',
      userId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error if user is not a recipient', async () => {
    const notification = MakeNotification({
      destination: {
        sendIds: [{ userId: 'other-user', readAt: undefined }],
      },
    })
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      userId: 'unauthorized-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
