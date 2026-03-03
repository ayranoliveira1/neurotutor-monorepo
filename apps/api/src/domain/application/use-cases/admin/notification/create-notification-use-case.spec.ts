import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { FakeNotificationQueueProvider } from '@test/providers/fake-notification-queue-provider'
import { CreateNotificationUseCase } from './create-notification-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let fakeNotificationQueueProvider: FakeNotificationQueueProvider
let sut: CreateNotificationUseCase

describe('Create Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    fakeNotificationQueueProvider = new FakeNotificationQueueProvider()
    sut = new CreateNotificationUseCase(
      inMemoryNotificationsRepository,
      fakeNotificationQueueProvider,
    )
  })

  it('should create a notification with specific sendIds', async () => {
    const result = await sut.execute({
      title: 'Nova notificação',
      message: 'Mensagem de teste',
      sendToAll: false,
      sendIds: ['user-1', 'user-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
    expect(fakeNotificationQueueProvider.enqueuedJobs).toHaveLength(1)
    expect(fakeNotificationQueueProvider.enqueuedJobs[0]).toEqual(
      expect.objectContaining({
        notificationId: expect.any(String),
        sendToAll: false,
        recipientIds: ['user-1', 'user-2'],
      }),
    )
  })

  it('should create notification for all users when sendToAll is true', async () => {
    const result = await sut.execute({
      title: 'Aviso geral',
      message: 'Para todos',
      sendToAll: true,
      sendIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
    expect(fakeNotificationQueueProvider.enqueuedJobs).toHaveLength(1)
    expect(fakeNotificationQueueProvider.enqueuedJobs[0]).toEqual(
      expect.objectContaining({
        sendToAll: true,
        recipientIds: [],
      }),
    )
  })

  it('should not create notification without recipients', async () => {
    const result = await sut.execute({
      title: 'Notificação sem destinatários',
      message: 'Esta notificação não deveria ser criada',
      sendToAll: false,
      sendIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryNotificationsRepository.items).toHaveLength(0)
    expect(fakeNotificationQueueProvider.enqueuedJobs).toHaveLength(0)
  })
})
