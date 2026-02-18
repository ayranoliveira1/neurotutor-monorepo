import { describe, it, expect } from 'vitest'
import { formatTime } from '../format-time'

describe('formatTime', () => {
  it('deve retornar segundos quando menor que 60', () => {
    expect(formatTime(0)).toBe('0s')
    expect(formatTime(1)).toBe('1s')
    expect(formatTime(59)).toBe('59s')
  })

  it('deve retornar apenas minutos quando segundos é 0', () => {
    expect(formatTime(60)).toBe('1min')
    expect(formatTime(120)).toBe('2min')
    expect(formatTime(300)).toBe('5min')
  })

  it('deve retornar minutos e segundos', () => {
    expect(formatTime(61)).toBe('1min 1s')
    expect(formatTime(90)).toBe('1min 30s')
    expect(formatTime(125)).toBe('2min 5s')
    expect(formatTime(3661)).toBe('61min 1s')
  })
})
