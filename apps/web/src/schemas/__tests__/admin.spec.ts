import { describe, it, expect } from 'vitest'
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  adminCreatePlanSchema,
  adminUpdatePlanSchema,
} from '../admin'

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

describe('adminCreatePlanSchema', () => {
  it('should validate a valid input', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: 4990,
      cycle: 'MONTHLY',
    })
    expect(result.success).toBe(true)
  })

  it('should validate with optional description', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: 4990,
      description: 'Plano profissional',
      cycle: 'MONTHLY',
    })
    expect(result.success).toBe(true)
  })

  it('should default cycle to MONTHLY', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: 4990,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cycle).toBe('MONTHLY')
    }
  })

  it('should reject empty name', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: '',
      slug: 'pro',
      priceCents: 4990,
    })
    expect(result.success).toBe(false)
  })

  it('should reject short name', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'AB',
      slug: 'pro',
      priceCents: 4990,
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty slug', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: '',
      priceCents: 4990,
    })
    expect(result.success).toBe(false)
  })

  it('should reject short slug', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'a',
      priceCents: 4990,
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative price', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: -1,
    })
    expect(result.success).toBe(false)
  })

  it('should coerce priceCents from string', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: '4990',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.priceCents).toBe(4990)
    }
  })

  it('should reject invalid cycle', () => {
    const result = adminCreatePlanSchema.safeParse({
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: 4990,
      cycle: 'DAILY',
    })
    expect(result.success).toBe(false)
  })

  it('should accept all valid cycles', () => {
    for (const cycle of ['WEEKLY', 'MONTHLY', 'YEARLY']) {
      const result = adminCreatePlanSchema.safeParse({
        name: 'Plano Pro',
        slug: 'pro',
        priceCents: 4990,
        cycle,
      })
      expect(result.success).toBe(true)
    }
  })
})

describe('adminUpdatePlanSchema', () => {
  it('should validate with all fields', () => {
    const result = adminUpdatePlanSchema.safeParse({
      id: '123',
      name: 'Plano Pro',
      slug: 'pro',
      priceCents: 4990,
      description: 'Descrição',
      cycle: 'MONTHLY',
      active: 'true',
    })
    expect(result.success).toBe(true)
  })

  it('should validate with only id', () => {
    const result = adminUpdatePlanSchema.safeParse({
      id: '123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty id', () => {
    const result = adminUpdatePlanSchema.safeParse({
      id: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short name', () => {
    const result = adminUpdatePlanSchema.safeParse({
      id: '123',
      name: 'AB',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short slug', () => {
    const result = adminUpdatePlanSchema.safeParse({
      id: '123',
      slug: 'a',
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative price', () => {
    const result = adminUpdatePlanSchema.safeParse({
      id: '123',
      priceCents: -1,
    })
    expect(result.success).toBe(false)
  })

  it('should accept active as string enum', () => {
    const resultTrue = adminUpdatePlanSchema.safeParse({
      id: '123',
      active: 'true',
    })
    const resultFalse = adminUpdatePlanSchema.safeParse({
      id: '123',
      active: 'false',
    })
    expect(resultTrue.success).toBe(true)
    expect(resultFalse.success).toBe(true)
  })
})
