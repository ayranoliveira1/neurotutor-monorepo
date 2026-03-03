import { describe, it, expect } from 'vitest'
import { pomodoroReducer, DEFAULT_SETTINGS, type PomodoroState } from '../use-pomodoro-timer'

function getInitial(): PomodoroState {
  return {
    phase: 'IDLE',
    secondsLeft: DEFAULT_SETTINGS.workMins * 60,
    pomodorosCompleted: 0,
    cyclesSinceLastLong: 0,
    startedAt: null,
    pausedPhase: null,
    settings: DEFAULT_SETTINGS,
  }
}

describe('pomodoroReducer', () => {
  it('estado inicial deve ser IDLE com 25min no relógio', () => {
    const state = getInitial()
    expect(state.phase).toBe('IDLE')
    expect(state.secondsLeft).toBe(25 * 60)
  })

  it('dispatch START deve mudar phase para WORK e registrar startedAt', () => {
    const state = getInitial()
    const next = pomodoroReducer(state, { type: 'START' })
    expect(next.phase).toBe('WORK')
    expect(next.startedAt).not.toBeNull()
    expect(next.secondsLeft).toBe(25 * 60)
  })

  it('dispatch PAUSE deve mudar phase para PAUSED', () => {
    const state = { ...getInitial(), phase: 'WORK' as const }
    const next = pomodoroReducer(state, { type: 'PAUSE' })
    expect(next.phase).toBe('PAUSED')
    expect(next.pausedPhase).toBe('WORK')
  })

  it('dispatch RESUME deve voltar para WORK', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'PAUSED',
      pausedPhase: 'WORK',
    }
    const next = pomodoroReducer(state, { type: 'RESUME' })
    expect(next.phase).toBe('WORK')
    expect(next.pausedPhase).toBeNull()
  })

  it('dispatch TICK deve decrementar secondsLeft em 1', () => {
    const state = { ...getInitial(), phase: 'WORK' as const, secondsLeft: 100 }
    const next = pomodoroReducer(state, { type: 'TICK' })
    expect(next.secondsLeft).toBe(99)
  })

  it('ao TICK com secondsLeft=0 e phase=WORK deve mudar para SHORT_BREAK', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'WORK',
      secondsLeft: 0,
      cyclesSinceLastLong: 0,
    }
    const next = pomodoroReducer(state, { type: 'TICK' })
    expect(next.phase).toBe('SHORT_BREAK')
    expect(next.pomodorosCompleted).toBe(1)
  })

  it('ao TICK com secondsLeft=0 e phase=SHORT_BREAK deve voltar para WORK', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'SHORT_BREAK',
      secondsLeft: 0,
    }
    const next = pomodoroReducer(state, { type: 'TICK' })
    expect(next.phase).toBe('WORK')
  })

  it('SHORT_BREAK não deve resetar cyclesSinceLastLong', () => {
    // Bug fix: cycles must be preserved across SHORT_BREAK so LONG_BREAK can trigger
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'SHORT_BREAK',
      secondsLeft: 0,
      cyclesSinceLastLong: 2,
    }
    const next = pomodoroReducer(state, { type: 'TICK' })
    expect(next.phase).toBe('WORK')
    expect(next.cyclesSinceLastLong).toBe(2)
  })

  it('após 4 ciclos WORK deve mudar para LONG_BREAK', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'WORK',
      secondsLeft: 0,
      cyclesSinceLastLong: 3, // 3 + 1 = 4 = cyclesBeforeLong
    }
    const next = pomodoroReducer(state, { type: 'TICK' })
    expect(next.phase).toBe('LONG_BREAK')
  })

  it('ciclo completo WORK→SHORT_BREAK→WORK→SHORT_BREAK→...→LONG_BREAK via TICK', () => {
    // Simula 4 pomodoros naturais e verifica que LONG_BREAK é acionado
    let state: PomodoroState = { ...getInitial(), phase: 'IDLE' }
    state = pomodoroReducer(state, { type: 'START' })

    for (let cycle = 0; cycle < 4; cycle++) {
      // Complete WORK
      state = pomodoroReducer({ ...state, secondsLeft: 0 }, { type: 'TICK' })
      if (cycle < 3) {
        expect(state.phase).toBe('SHORT_BREAK')
        // Complete SHORT_BREAK
        state = pomodoroReducer({ ...state, secondsLeft: 0 }, { type: 'TICK' })
        expect(state.phase).toBe('WORK')
        expect(state.cyclesSinceLastLong).toBe(cycle + 1)
      }
    }

    expect(state.phase).toBe('LONG_BREAK')
  })

  it('LONG_BREAK deve resetar cyclesSinceLastLong ao voltar para WORK', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'LONG_BREAK',
      secondsLeft: 0,
      cyclesSinceLastLong: 4,
    }
    const next = pomodoroReducer(state, { type: 'TICK' })
    expect(next.phase).toBe('WORK')
    expect(next.cyclesSinceLastLong).toBe(0)
  })

  it('dispatch STOP deve mudar phase para IDLE e zerar contadores', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'WORK',
      pomodorosCompleted: 3,
      cyclesSinceLastLong: 2,
      startedAt: new Date(),
    }
    const next = pomodoroReducer(state, { type: 'STOP' })
    expect(next.phase).toBe('IDLE')
    expect(next.pomodorosCompleted).toBe(0)
    expect(next.cyclesSinceLastLong).toBe(0)
    expect(next.startedAt).toBeNull()
  })

  it('dispatch SKIP deve pular para próxima fase', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'WORK',
      secondsLeft: 600,
      cyclesSinceLastLong: 0,
    }
    const next = pomodoroReducer(state, { type: 'SKIP' })
    expect(next.phase).toBe('SHORT_BREAK')
    expect(next.pomodorosCompleted).toBe(1)
  })

  it('SKIP de SHORT_BREAK deve preservar cyclesSinceLastLong', () => {
    const state: PomodoroState = {
      ...getInitial(),
      phase: 'SHORT_BREAK',
      secondsLeft: 200,
      cyclesSinceLastLong: 2,
    }
    const next = pomodoroReducer(state, { type: 'SKIP' })
    expect(next.phase).toBe('WORK')
    expect(next.cyclesSinceLastLong).toBe(2)
  })
})
