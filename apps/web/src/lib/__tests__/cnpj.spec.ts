import { describe, it, expect } from 'vitest'
import { isValidCnpj, formatCnpj, stripCnpj } from '../cnpj'

describe('isValidCnpj', () => {
  it('should accept a valid CNPJ (digits only)', () => {
    expect(isValidCnpj('11222333000181')).toBe(true)
  })

  it('should accept a valid CNPJ (masked)', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
  })

  it('should reject CNPJ with wrong check digits', () => {
    expect(isValidCnpj('11222333000199')).toBe(false)
  })

  it('should reject CNPJ with all same digits', () => {
    expect(isValidCnpj('11111111111111')).toBe(false)
  })

  it('should reject CNPJ with wrong length', () => {
    expect(isValidCnpj('1122233300018')).toBe(false)
    expect(isValidCnpj('112223330001811')).toBe(false)
  })

  it('should reject empty string', () => {
    expect(isValidCnpj('')).toBe(false)
  })
})

describe('formatCnpj', () => {
  it('should format a complete CNPJ', () => {
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('should format progressively as digits are added', () => {
    expect(formatCnpj('11')).toBe('11')
    expect(formatCnpj('112')).toBe('11.2')
    expect(formatCnpj('11222')).toBe('11.222')
    expect(formatCnpj('112223')).toBe('11.222.3')
    expect(formatCnpj('11222333')).toBe('11.222.333')
    expect(formatCnpj('112223330')).toBe('11.222.333/0')
    expect(formatCnpj('112223330001')).toBe('11.222.333/0001')
    expect(formatCnpj('1122233300018')).toBe('11.222.333/0001-8')
  })

  it('should strip non-digit characters before formatting', () => {
    expect(formatCnpj('11.222.333/0001-81')).toBe('11.222.333/0001-81')
  })

  it('should truncate to 14 digits', () => {
    expect(formatCnpj('112223330001819999')).toBe('11.222.333/0001-81')
  })
})

describe('stripCnpj', () => {
  it('should remove all non-digit characters', () => {
    expect(stripCnpj('11.222.333/0001-81')).toBe('11222333000181')
  })

  it('should return digits unchanged', () => {
    expect(stripCnpj('11222333000181')).toBe('11222333000181')
  })
})
