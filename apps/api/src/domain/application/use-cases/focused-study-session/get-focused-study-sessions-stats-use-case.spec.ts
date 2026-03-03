import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryFocusedStudySessionsRepository } from '@test/repositories/in-memory-focused-study-sessions-repository'
import { MakeFocusedStudySession } from '@test/factories/make-focused-study-session'
import { GetFocusedStudySessionsStatsUseCase } from './get-focused-study-sessions-stats-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let focusedStudySessionsRepository: InMemoryFocusedStudySessionsRepository
let sut: GetFocusedStudySessionsStatsUseCase

describe('GetFocusedStudySessionsStatsUseCase', () => {
  beforeEach(() => {
    focusedStudySessionsRepository =
      new InMemoryFocusedStudySessionsRepository()
    sut = new GetFocusedStudySessionsStatsUseCase(
      focusedStudySessionsRepository,
    )
  })

  it('deve retornar totalSessions, totalPomodoros e totalTimeSeconds corretos', async () => {
    const date = new Date('2026-03-01T10:00:00Z')

    focusedStudySessionsRepository.items.push(
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 2,
        totalTimeSpentSeconds: 3000,
        createdAt: date,
        startedAt: date,
        completedAt: new Date(date.getTime() + 3000 * 1000),
      }),
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 4,
        totalTimeSpentSeconds: 6000,
        createdAt: date,
        startedAt: date,
        completedAt: new Date(date.getTime() + 6000 * 1000),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-01'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.stats.totalSessions).toBe(2)
      expect(result.value.stats.totalPomodoros).toBe(6)
      expect(result.value.stats.totalTimeSeconds).toBe(9000)
    }
  })

  it('deve agrupar sessões por dia corretamente', async () => {
    const day1 = new Date('2026-03-01T10:00:00Z')
    const day2 = new Date('2026-03-02T10:00:00Z')

    focusedStudySessionsRepository.items.push(
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 2,
        createdAt: day1,
        startedAt: day1,
        completedAt: new Date(day1.getTime() + 3000 * 1000),
      }),
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 1,
        createdAt: day1,
        startedAt: day1,
        completedAt: new Date(day1.getTime() + 1500 * 1000),
      }),
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 3,
        createdAt: day2,
        startedAt: day2,
        completedAt: new Date(day2.getTime() + 4500 * 1000),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-01'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.stats.sessionsByDay).toHaveLength(2)
      const day1Entry = result.value.stats.sessionsByDay.find(
        (d) => d.date === '2026-03-01',
      )
      const day2Entry = result.value.stats.sessionsByDay.find(
        (d) => d.date === '2026-03-02',
      )
      expect(day1Entry?.count).toBe(2)
      expect(day1Entry?.pomodoros).toBe(3)
      expect(day2Entry?.count).toBe(1)
      expect(day2Entry?.pomodoros).toBe(3)
    }
  })

  it('deve retornar zeros quando não há sessões no período', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-01'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.stats.totalSessions).toBe(0)
      expect(result.value.stats.totalPomodoros).toBe(0)
      expect(result.value.stats.totalTimeSeconds).toBe(0)
      expect(result.value.stats.sessionsByDay).toHaveLength(0)
    }
  })

  it('deve respeitar o intervalo de datas', async () => {
    const inRange = new Date('2026-03-01T10:00:00Z')
    const outOfRange = new Date('2026-01-01T10:00:00Z')

    focusedStudySessionsRepository.items.push(
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 2,
        createdAt: inRange,
        startedAt: inRange,
        completedAt: new Date(inRange.getTime() + 3000 * 1000),
      }),
      MakeFocusedStudySession({
        userId: new UniqueEntityID('user-1'),
        pomodorosCompleted: 4,
        createdAt: outOfRange,
        startedAt: outOfRange,
        completedAt: new Date(outOfRange.getTime() + 6000 * 1000),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-01'),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.stats.totalSessions).toBe(1)
      expect(result.value.stats.totalPomodoros).toBe(2)
    }
  })
})
