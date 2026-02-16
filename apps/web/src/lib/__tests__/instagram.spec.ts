import { describe, it, expect } from 'vitest'
import { formatInstagram } from '../instagram'

describe('formatInstagram', () => {
  it('should prepend @ when missing', () => {
    expect(formatInstagram('suaconfeitaria')).toBe('@suaconfeitaria')
  })

  it('should not duplicate @ when already present', () => {
    expect(formatInstagram('@suaconfeitaria')).toBe('@suaconfeitaria')
  })

  it('should strip multiple leading @s', () => {
    expect(formatInstagram('@@suaconfeitaria')).toBe('@suaconfeitaria')
  })

  it('should return empty string unchanged', () => {
    expect(formatInstagram('')).toBe('')
  })

  it('should return lone @ unchanged', () => {
    expect(formatInstagram('@')).toBe('@')
  })

  it('should trim whitespace', () => {
    expect(formatInstagram('  suaconfeitaria  ')).toBe('@suaconfeitaria')
  })
})
