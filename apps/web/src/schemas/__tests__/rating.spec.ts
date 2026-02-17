import { describe, it, expect } from 'vitest'
import { createRatingSchema } from '../rating'

describe('createRatingSchema', () => {
  it('should validate a correct rating input', () => {
    const result = createRatingSchema.safeParse({
      rating: 5,
      description: 'Excelente plataforma!',
    })
    expect(result.success).toBe(true)
  })

  it('should validate all valid rating values (1-5)', () => {
    for (let i = 1; i <= 5; i++) {
      const result = createRatingSchema.safeParse({
        rating: i,
        description: 'Avaliação',
      })
      expect(result.success).toBe(true)
    }
  })

  it('should reject rating below 1', () => {
    const result = createRatingSchema.safeParse({
      rating: 0,
      description: 'Ruim',
    })
    expect(result.success).toBe(false)
  })

  it('should reject rating above 5', () => {
    const result = createRatingSchema.safeParse({
      rating: 6,
      description: 'Demais',
    })
    expect(result.success).toBe(false)
  })

  it('should reject non-integer rating', () => {
    const result = createRatingSchema.safeParse({
      rating: 3.5,
      description: 'Boa',
    })
    expect(result.success).toBe(false)
  })

  it('should accept empty description', () => {
    const result = createRatingSchema.safeParse({
      rating: 4,
      description: '',
    })
    expect(result.success).toBe(true)
  })

  it('should accept missing description', () => {
    const result = createRatingSchema.safeParse({
      rating: 4,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toBe('')
    }
  })
})
