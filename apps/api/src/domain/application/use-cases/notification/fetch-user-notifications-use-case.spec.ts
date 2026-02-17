import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { MakeNotification } from '@test/factories/make-notification'
import { FetchUserNotificationsUseCase } from './fetch-user-notifications-use-case'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: FetchUserNotificationsUseCase

describe('Fetch User Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new FetchUserNotificationsUseCase(inMemoryNotificationsRepository)
  })

  it('should fetch notifications for a specific user', async () => {
    const userId = 'user-1'

    await inMemoryNotificationsRepository.create(
      MakeNotification({
        destination: {
          sendIds: [{ userId, readAt: undefined }],
        },
      }),
    )

    await inMemoryNotificationsRepository.create(
      MakeNotification({
        destination: {
          sendIds: [{ userId: 'other-user', readAt: undefined }],
        },
      }),
    )

    await inMemoryNotificationsRepository.create(
      MakeNotification({
        destination: {
          sendIds: [
            { userId, readAt: undefined },
            { userId: 'other-user', readAt: undefined },
          ],
        },
      }),
    )

    const result = await sut.execute({ userId })

    expect(result.isRight()).toBe(true)
    expect(result.value.notifications).toHaveLength(2)
  })

  it('should return empty array when user has no notifications', async () => {
    const result = await sut.execute({ userId: 'user-without-notifications' })

    expect(result.isRight()).toBe(true)
    expect(result.value.notifications).toHaveLength(0)
  })
})
