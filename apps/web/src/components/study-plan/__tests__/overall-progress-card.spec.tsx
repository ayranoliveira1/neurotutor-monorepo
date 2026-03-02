import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OverallProgressCard } from '../overall-progress-card'
import type { OverallProgressData } from '@/actions/study-plan/types'

const makeOverall = (
  overrides: Partial<OverallProgressData> = {},
): OverallProgressData => ({
  totalQuestions: 150,
  totalCorrect: 105,
  avgAccuracy: 70,
  daysRemaining: 45,
  daysElapsed: 30,
  totalDays: 75,
  ...overrides,
})

describe('OverallProgressCard', () => {
  it('deve renderizar total de questões', () => {
    render(<OverallProgressCard overall={makeOverall()} />)

    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('Questões respondidas')).toBeInTheDocument()
  })

  it('deve renderizar taxa de acertos média', () => {
    render(<OverallProgressCard overall={makeOverall()} />)

    expect(screen.getByText('70%')).toBeInTheDocument()
    expect(screen.getByText('Taxa de acertos média')).toBeInTheDocument()
  })

  it('deve renderizar dias restantes', () => {
    render(<OverallProgressCard overall={makeOverall()} />)

    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('Dias restantes')).toBeInTheDocument()
  })

  it('deve renderizar dias decorridos', () => {
    render(<OverallProgressCard overall={makeOverall()} />)

    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('Dias decorridos')).toBeInTheDocument()
  })
})
