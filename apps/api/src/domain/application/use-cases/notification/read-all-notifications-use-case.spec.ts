import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { MakeNotification } from '@test/factories/make-notification'
import { ReadAllNotificationsUseCase } from './read-all-notifications-use-case'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadAllNotificationsUseCase

describe('Read All Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadAllNotificationsUseCase(inMemoryNotificationsRepository)
  })

  it('should mark all unread notifications as read for the user', async () => {
    const userId = 'user-1'

    await inMemoryNotificationsRepository.create(
      MakeNotification({
        destination: {
          sendIds: [
            { userId, readAt: undefined },
            { userId: 'user-2', readAt: undefined },
          ],
        },
      }),
    )

    await inMemoryNotificationsRepository.create(
      MakeNotification({
        destination: {
          sendIds: [{ userId, readAt: undefined }],
        },
      }),
    )

    const result = await sut.execute({ userId })

    expect(result.isRight()).toBe(true)

    const notifications = inMemoryNotificationsRepository.items
    for (const notification of notifications) {
      const userSendId = notification.destination.sendIds.find(
        (id) => id.userId === userId,
      )
      expect(userSendId?.readAt).toBeInstanceOf(Date)
    }

    const otherSendId = notifications[0].destination.sendIds.find(
      (id) => id.userId === 'user-2',
    )
    expect(otherSendId?.readAt).toBeUndefined()
  })

  it('should skip already read notifications', async () => {
    const userId = 'user-1'
    const existingReadAt = new Date('2024-01-01')

    await inMemoryNotificationsRepository.create(
      MakeNotification({
        destination: {
          sendIds: [{ userId, readAt: existingReadAt }],
        },
      }),
    )

    const result = await sut.execute({ userId })

    expect(result.isRight()).toBe(true)

    const userSendId =
      inMemoryNotificationsRepository.items[0].destination.sendIds.find(
        (id) => id.userId === userId,
      )
    expect(userSendId?.readAt).toEqual(existingReadAt)
  })

  it('should handle user with no notifications', async () => {
    const result = await sut.execute({ userId: 'user-without-notifications' })

    expect(result.isRight()).toBe(true)
  })
})
