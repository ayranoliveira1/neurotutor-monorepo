import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryFocusedStudySessionsRepository } from '@test/repositories/in-memory-focused-study-sessions-repository'
import { SaveFocusedStudySessionUseCase } from './save-focused-study-session-use-case'
import { FocusedStudySessionStatus } from '@/domain/entreprise/entities/focused-study-session'

let focusedStudySessionsRepository: InMemoryFocusedStudySessionsRepository
let sut: SaveFocusedStudySessionUseCase

describe('SaveFocusedStudySessionUseCase', () => {
  beforeEach(() => {
    focusedStudySessionsRepository =
      new InMemoryFocusedStudySessionsRepository()
    sut = new SaveFocusedStudySessionUseCase(focusedStudySessionsRepository)
  })

  it('deve salvar sessão COMPLETED com dados válidos', async () => {
    const startedAt = new Date('2026-03-01T10:00:00Z')
    const completedAt = new Date('2026-03-01T10:50:00Z')

    const result = await sut.execute({
      userId: 'user-1',
      status: FocusedStudySessionStatus.COMPLETED,
      pomodoroIntervalMins: 25,
      breakDurationMins: 5,
      pomodorosCompleted: 2,
      totalTimeSpentSeconds: 3000,
      startedAt,
      completedAt,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.session.status).toBe(FocusedStudySessionStatus.COMPLETED)
      expect(result.value.session.pomodorosCompleted).toBe(2)
    }
    expect(focusedStudySessionsRepository.items).toHaveLength(1)
  })

  it('deve salvar sessão ABANDONED com 0 pomodoros', async () => {
    const startedAt = new Date('2026-03-01T10:00:00Z')
    const completedAt = new Date('2026-03-01T10:10:00Z')

    const result = await sut.execute({
      userId: 'user-1',
      status: FocusedStudySessionStatus.ABANDONED,
      pomodoroIntervalMins: 25,
      breakDurationMins: 5,
      pomodorosCompleted: 0,
      totalTimeSpentSeconds: 600,
      startedAt,
      completedAt,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.session.status).toBe(FocusedStudySessionStatus.ABANDONED)
      expect(result.value.session.pomodorosCompleted).toBe(0)
    }
  })

  it('deve retornar erro se totalTimeSpentSeconds for 0', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      status: FocusedStudySessionStatus.ABANDONED,
      pomodoroIntervalMins: 25,
      breakDurationMins: 5,
      pomodorosCompleted: 0,
      totalTimeSpentSeconds: 0,
      startedAt: new Date(),
      completedAt: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(focusedStudySessionsRepository.items).toHaveLength(0)
  })

  it('deve retornar erro se pomodorosCompleted for negativo', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      status: FocusedStudySessionStatus.ABANDONED,
      pomodoroIntervalMins: 25,
      breakDurationMins: 5,
      pomodorosCompleted: -1,
      totalTimeSpentSeconds: 300,
      startedAt: new Date('2026-03-01T10:00:00Z'),
      completedAt: new Date('2026-03-01T10:05:00Z'),
    })

    expect(result.isLeft()).toBe(true)
    expect(focusedStudySessionsRepository.items).toHaveLength(0)
  })

  it('deve retornar erro se completedAt for anterior a startedAt', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      status: FocusedStudySessionStatus.COMPLETED,
      pomodoroIntervalMins: 25,
      breakDurationMins: 5,
      pomodorosCompleted: 2,
      totalTimeSpentSeconds: 3000,
      startedAt: new Date('2026-03-01T11:00:00Z'),
      completedAt: new Date('2026-03-01T10:00:00Z'),
    })

    expect(result.isLeft()).toBe(true)
    expect(focusedStudySessionsRepository.items).toHaveLength(0)
  })

  it('deve retornar erro se completedAt for igual a startedAt', async () => {
    const date = new Date('2026-03-01T10:00:00Z')
    const result = await sut.execute({
      userId: 'user-1',
      status: FocusedStudySessionStatus.ABANDONED,
      pomodoroIntervalMins: 25,
      breakDurationMins: 5,
      pomodorosCompleted: 0,
      totalTimeSpentSeconds: 1,
      startedAt: date,
      completedAt: date,
    })

    expect(result.isLeft()).toBe(true)
    expect(focusedStudySessionsRepository.items).toHaveLength(0)
  })
})
