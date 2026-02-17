import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { MakeNotification } from '@test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should mark notification as read for the user', async () => {
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

    const updated = inMemoryNotificationsRepository.items[0]
    const userSendId = updated.destination.sendIds.find(
      (id) => id.userId === userId,
    )
    expect(userSendId?.readAt).toBeInstanceOf(Date)

    const otherSendId = updated.destination.sendIds.find(
      (id) => id.userId === 'user-2',
    )
    expect(otherSendId?.readAt).toBeUndefined()
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
