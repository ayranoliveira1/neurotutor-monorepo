import { describe, it, expect } from 'vitest'
import { signInSchema, signUpSchema } from '../auth'

describe('signInSchema', () => {
  it('should validate a correct sign-in input', () => {
    const result = signInSchema.safeParse({
      email: 'maria@email.com',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty email', () => {
    const result = signInSchema.safeParse({
      email: '',
      password: '12345678',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'E-mail é obrigatório',
      )
    }
  })

  it('should reject invalid email format', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: '12345678',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'E-mail inválido',
      )
    }
  })

  it('should reject empty password', () => {
    const result = signInSchema.safeParse({
      email: 'maria@email.com',
      password: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Senha é obrigatória',
      )
    }
  })

  it('should reject password shorter than 8 characters', () => {
    const result = signInSchema.safeParse({
      email: 'maria@email.com',
      password: '1234567',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Senha deve ter no mínimo 8 caracteres',
      )
    }
  })
})

describe('signUpSchema', () => {
  it('should validate a correct sign-up input', () => {
    const result = signUpSchema.safeParse({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = signUpSchema.safeParse({
      name: '',
      email: 'maria@email.com',
      password: '12345678',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Nome é obrigatório',
      )
    }
  })

  it('should reject name shorter than 3 characters', () => {
    const result = signUpSchema.safeParse({
      name: 'Ma',
      email: 'maria@email.com',
      password: '12345678',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        'Nome deve ter no mínimo 3 caracteres',
      )
    }
  })

  it('should reject password longer than 20 characters', () => {
    const result = signUpSchema.safeParse({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456789012345678901',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        'Senha deve ter no máximo 20 caracteres',
      )
    }
  })

  it('should reject invalid email', () => {
    const result = signUpSchema.safeParse({
      name: 'Maria Silva',
      email: 'invalid',
      password: '12345678',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        'E-mail inválido',
      )
    }
  })
})
