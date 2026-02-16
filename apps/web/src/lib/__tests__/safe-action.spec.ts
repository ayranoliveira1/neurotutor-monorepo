import { describe, it, expect } from 'vitest'
import { actionClient } from '../safe-action'

describe('actionClient', () => {
  it('should be defined', () => {
    expect(actionClient).toBeDefined()
  })

  it('should expose action and schema methods', () => {
    expect(typeof actionClient.action).toBe('function')
    expect(typeof actionClient.schema).toBe('function')
  })
})
