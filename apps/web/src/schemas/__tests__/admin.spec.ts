import { describe, it, expect } from 'vitest'
import { adminCreateUserSchema, adminUpdateUserSchema } from '../admin'

describe('adminCreateUserSchema', () => {
  it('should validate a valid input', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
    })
    expect(result.success).toBe(true)
  })

  it('should validate with optional role', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
      role: 'ADMIN',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = adminCreateUserSchema.safeParse({
      name: '',
      email: 'joao@email.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid email', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'invalid',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
    })
    expect(result.success).toBe(false)
  })

  it('should reject short password', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123',
      planSlug: 'pro',
      durationDays: 30,
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty planSlug', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      planSlug: '',
      durationDays: 30,
    })
    expect(result.success).toBe(false)
  })

  it('should reject zero durationDays', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 0,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid role', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
      role: 'INVALID',
    })
    expect(result.success).toBe(false)
  })

  it('should coerce durationDays from string', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: '30',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.durationDays).toBe(30)
    }
  })
})

describe('adminUpdateUserSchema', () => {
  it('should validate with all optional fields', () => {
    const result = adminUpdateUserSchema.safeParse({
      id: '123',
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'TEACHER',
    })
    expect(result.success).toBe(true)
  })

  it('should validate with only id', () => {
    const result = adminUpdateUserSchema.safeParse({
      id: '123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty id', () => {
    const result = adminUpdateUserSchema.safeParse({
      id: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short name', () => {
    const result = adminUpdateUserSchema.safeParse({
      id: '123',
      name: 'AB',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid email', () => {
    const result = adminUpdateUserSchema.safeParse({
      id: '123',
      email: 'invalid',
    })
    expect(result.success).toBe(false)
  })
})
