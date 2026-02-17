import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { FakeSocketProvider } from '@test/providers/fake-socket-provider'
import { CreateNotificationUseCase } from './create-notification-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let fakeSocketProvider: FakeSocketProvider
let sut: CreateNotificationUseCase

describe('Create Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    fakeSocketProvider = new FakeSocketProvider()
    sut = new CreateNotificationUseCase(
      inMemoryNotificationsRepository,
      fakeSocketProvider,
    )
  })

  it('should create a notification with specific sendIds', async () => {
    const result = await sut.execute({
      title: 'Nova notificação',
      message: 'Mensagem de teste',
      sendIds: ['user-1', 'user-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        notification: expect.objectContaining({
          props: expect.objectContaining({
            title: 'Nova notificação',
            content: 'Mensagem de teste',
            destination: {
              sendIds: [
                { userId: 'user-1', readAt: undefined },
                { userId: 'user-2', readAt: undefined },
              ],
            },
          }),
        }),
      }),
    )
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
    expect(fakeSocketProvider.notificationsSent).toHaveLength(1)
  })

  it('should not create notification without recipients', async () => {
    const result = await sut.execute({
      title: 'Notificação sem destinatários',
      message: 'Esta notificação não deveria ser criada',
      sendIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryNotificationsRepository.items).toHaveLength(0)
    expect(fakeSocketProvider.notificationsSent).toHaveLength(0)
  })
})
