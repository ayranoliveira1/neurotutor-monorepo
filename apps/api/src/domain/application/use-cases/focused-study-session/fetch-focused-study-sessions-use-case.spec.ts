import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryFocusedStudySessionsRepository } from '@test/repositories/in-memory-focused-study-sessions-repository'
import { MakeFocusedStudySession } from '@test/factories/make-focused-study-session'
import { FetchFocusedStudySessionsUseCase } from './fetch-focused-study-sessions-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let focusedStudySessionsRepository: InMemoryFocusedStudySessionsRepository
let sut: FetchFocusedStudySessionsUseCase

describe('FetchFocusedStudySessionsUseCase', () => {
  beforeEach(() => {
    focusedStudySessionsRepository =
      new InMemoryFocusedStudySessionsRepository()
    sut = new FetchFocusedStudySessionsUseCase(focusedStudySessionsRepository)
  })

  it('deve listar sessões do usuário com paginação', async () => {
    for (let i = 0; i < 15; i++) {
      focusedStudySessionsRepository.items.push(
        MakeFocusedStudySession({ userId: new UniqueEntityID('user-1') }),
      )
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(10)
      expect(result.value.totalItems).toBe(15)
      expect(result.value.totalPages).toBe(2)
      expect(result.value.currentPage).toBe(1)
    }
  })

  it('deve retornar lista vazia quando usuário não tem sessões', async () => {
    const result = await sut.execute({
      userId: 'user-sem-sessoes',
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(0)
      expect(result.value.totalItems).toBe(0)
    }
  })

  it('deve filtrar por startDate e endDate', async () => {
    const oldDate = new Date('2026-01-01T10:00:00Z')
    const recentDate = new Date('2026-03-01T10:00:00Z')

    focusedStudySessionsRepository.items.push(
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        createdAt: oldDate,
        startedAt: oldDate,
        completedAt: new Date(oldDate.getTime() + 3000 * 1000),
      }),
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        createdAt: recentDate,
        startedAt: recentDate,
        completedAt: new Date(recentDate.getTime() + 3000 * 1000),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-01'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(1)
    }
  })

  it('deve retornar apenas sessões do userId correto', async () => {
    focusedStudySessionsRepository.items.push(
      MakeFocusedStudySession({ userId: new UniqueEntityID('user-1') }),
      MakeFocusedStudySession({ userId: new UniqueEntityID('user-2') }),
      MakeFocusedStudySession({ userId: new UniqueEntityID('user-1') }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(2)
      result.value.sessions.forEach((s) => {
        expect(s.userId.toString()).toBe('user-1')
      })
    }
  })
})
