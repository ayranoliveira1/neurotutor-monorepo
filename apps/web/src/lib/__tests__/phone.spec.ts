import { describe, it, expect } from 'vitest'
import { formatPhone, stripPhone } from '../phone'

describe('formatPhone', () => {
  it('should format a complete phone number', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('should format progressively as digits are added', () => {
    expect(formatPhone('1')).toBe('1')
    expect(formatPhone('11')).toBe('11')
    expect(formatPhone('119')).toBe('(11) 9')
    expect(formatPhone('11999')).toBe('(11) 999')
    expect(formatPhone('1199999')).toBe('(11) 99999')
    expect(formatPhone('11999999')).toBe('(11) 99999-9')
    expect(formatPhone('1199999999')).toBe('(11) 99999-999')
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('should strip non-digit characters before formatting', () => {
    expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999')
  })

  it('should truncate to 11 digits', () => {
    expect(formatPhone('119999999991234')).toBe('(11) 99999-9999')
  })

  it('should handle empty string', () => {
    expect(formatPhone('')).toBe('')
  })
})

describe('stripPhone', () => {
  it('should remove all non-digit characters', () => {
    expect(stripPhone('(11) 99999-9999')).toBe('11999999999')
  })

  it('should return digits unchanged', () => {
    expect(stripPhone('11999999999')).toBe('11999999999')
  })

  it('should handle empty string', () => {
    expect(stripPhone('')).toBe('')
  })
})
