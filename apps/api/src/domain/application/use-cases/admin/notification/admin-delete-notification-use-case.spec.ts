import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { MakeNotification } from '@test/factories/make-notification'
import { AdminDeleteNotificationUseCase } from './admin-delete-notification-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: AdminDeleteNotificationUseCase

describe('Admin Delete Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new AdminDeleteNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should delete a notification permanently', async () => {
    const notification = MakeNotification()
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(0)
  })

  it('should return error if notification does not exist', async () => {
    const result = await sut.execute({
      notificationId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
