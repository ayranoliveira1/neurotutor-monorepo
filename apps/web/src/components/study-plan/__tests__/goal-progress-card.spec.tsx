import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GoalProgressCard } from '../goal-progress-card'
import type { GoalProgressData } from '@/actions/study-plan/types'

const makeGoal = (overrides: Partial<GoalProgressData> = {}): GoalProgressData => ({
  goalId: 'goal-1',
  subject: 'Matemática',
  weeklyQuestionsTarget: 20,
  targetAccuracyPercent: 80,
  currentWeekAnswered: 12,
  totalAnswered: 50,
  correctCount: 35,
  accuracyPercent: 70,
  weeklyProgress: 60,
  ...overrides,
})

describe('GoalProgressCard', () => {
  it('deve renderizar o nome da disciplina', () => {
    render(<GoalProgressCard goal={makeGoal()} />)

    expect(screen.getByText('Matemática')).toBeInTheDocument()
  })

  it('deve renderizar progresso semanal', () => {
    render(<GoalProgressCard goal={makeGoal()} />)

    expect(screen.getByText('12/20')).toBeInTheDocument()
    expect(screen.getByText('60% da meta semanal')).toBeInTheDocument()
  })

  it('deve renderizar taxa de acertos', () => {
    render(<GoalProgressCard goal={makeGoal()} />)

    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('deve renderizar total respondidas', () => {
    render(<GoalProgressCard goal={makeGoal()} />)

    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('deve renderizar meta de acertos quando presente', () => {
    render(<GoalProgressCard goal={makeGoal({ targetAccuracyPercent: 80 })} />)

    expect(screen.getByText('80%')).toBeInTheDocument()
  })

  it('deve renderizar acertos', () => {
    render(<GoalProgressCard goal={makeGoal()} />)

    expect(screen.getByText('35')).toBeInTheDocument()
  })
})
