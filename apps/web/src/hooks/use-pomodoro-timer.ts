export type Phase = 'IDLE' | 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK' | 'PAUSED'

export interface PomodoroSettings {
  workMins: number
  shortBreakMins: number
  longBreakMins: number
  cyclesBeforeLong: number
  dailyGoal: number
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMins: 25,
  shortBreakMins: 5,
  longBreakMins: 15,
  cyclesBeforeLong: 4,
  dailyGoal: 8,
}

export interface PomodoroState {
  phase: Phase
  secondsLeft: number
  pomodorosCompleted: number
  cyclesSinceLastLong: number
  startedAt: Date | null
  pausedPhase: Phase | null
  settings: PomodoroSettings
}

type PomodoroAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SKIP' }
  | { type: 'STOP' }
  | { type: 'TICK' }
  | { type: 'UPDATE_SETTINGS'; payload: PomodoroSettings }

function getNextPhase(
  current: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK',
  cyclesSinceLastLong: number,
  cyclesBeforeLong: number,
): Phase {
  if (current === 'WORK') {
    const nextCycles = cyclesSinceLastLong + 1
    return nextCycles >= cyclesBeforeLong ? 'LONG_BREAK' : 'SHORT_BREAK'
  }
  return 'WORK'
}

export function phaseSeconds(
  phase: Phase,
  settings: PomodoroSettings,
): number {
  switch (phase) {
    case 'WORK':
      return settings.workMins * 60
    case 'SHORT_BREAK':
      return settings.shortBreakMins * 60
    case 'LONG_BREAK':
      return settings.longBreakMins * 60
    default:
      return settings.workMins * 60
  }
}

export function pomodoroReducer(
  state: PomodoroState,
  action: PomodoroAction,
): PomodoroState {
  switch (action.type) {
    case 'START': {
      return {
        ...state,
        phase: 'WORK',
        secondsLeft: state.settings.workMins * 60,
        pomodorosCompleted: 0,
        cyclesSinceLastLong: 0,
        startedAt: new Date(),
        pausedPhase: null,
      }
    }

    case 'PAUSE': {
      if (state.phase === 'IDLE' || state.phase === 'PAUSED') return state
      return {
        ...state,
        pausedPhase: state.phase,
        phase: 'PAUSED',
      }
    }

    case 'RESUME': {
      if (state.phase !== 'PAUSED' || !state.pausedPhase) return state
      return {
        ...state,
        phase: state.pausedPhase,
        pausedPhase: null,
      }
    }

    case 'SKIP': {
      if (state.phase === 'IDLE' || state.phase === 'PAUSED') return state
      const activePhase = state.phase as 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
      const newPomodoros =
        activePhase === 'WORK'
          ? state.pomodorosCompleted + 1
          : state.pomodorosCompleted
      const newCycles =
        activePhase === 'WORK'
          ? state.cyclesSinceLastLong + 1
          : activePhase === 'LONG_BREAK'
            ? 0
            : state.cyclesSinceLastLong
      const nextPhase = getNextPhase(
        activePhase,
        state.cyclesSinceLastLong,
        state.settings.cyclesBeforeLong,
      )
      return {
        ...state,
        phase: nextPhase,
        secondsLeft: phaseSeconds(nextPhase, state.settings),
        pomodorosCompleted: newPomodoros,
        cyclesSinceLastLong:
          nextPhase === 'WORK'
            ? newCycles % state.settings.cyclesBeforeLong
            : newCycles,
      }
    }

    case 'STOP': {
      return {
        ...state,
        phase: 'IDLE',
        secondsLeft: state.settings.workMins * 60,
        pomodorosCompleted: 0,
        cyclesSinceLastLong: 0,
        startedAt: null,
        pausedPhase: null,
      }
    }

    case 'TICK': {
      if (state.phase === 'IDLE' || state.phase === 'PAUSED') return state
      if (state.secondsLeft > 0) {
        return { ...state, secondsLeft: state.secondsLeft - 1 }
      }
      const activePhase = state.phase as 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
      const newPomodoros =
        activePhase === 'WORK'
          ? state.pomodorosCompleted + 1
          : state.pomodorosCompleted
      const newCycles =
        activePhase === 'WORK'
          ? state.cyclesSinceLastLong + 1
          : activePhase === 'LONG_BREAK'
            ? 0
            : state.cyclesSinceLastLong
      const nextPhase = getNextPhase(
        activePhase,
        state.cyclesSinceLastLong,
        state.settings.cyclesBeforeLong,
      )
      const nextCycles =
        nextPhase === 'WORK'
          ? newCycles % state.settings.cyclesBeforeLong
          : newCycles
      return {
        ...state,
        phase: nextPhase,
        secondsLeft: phaseSeconds(nextPhase, state.settings),
        pomodorosCompleted: newPomodoros,
        cyclesSinceLastLong: nextCycles,
      }
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = action.payload
      return {
        ...state,
        settings: newSettings,
        secondsLeft:
          state.phase === 'IDLE'
            ? newSettings.workMins * 60
            : state.secondsLeft,
      }
    }

    default:
      return state
  }
}
