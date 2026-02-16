import { describe, it, expect } from 'vitest'
import { navigationGroups } from '../navigation'

describe('navigationGroups', () => {
  it('should have 1 group', () => {
    expect(navigationGroups).toHaveLength(1)
  })

  it('should have correct group titles', () => {
    const titles = navigationGroups.map((g) => g.title)
    expect(titles).toEqual(['Menu'])
  })

  it('should have items in every group', () => {
    for (const group of navigationGroups) {
      expect(group.items.length).toBeGreaterThan(0)
    }
  })

  it('should have unique hrefs across all items', () => {
    const hrefs = navigationGroups.flatMap((g) => g.items.map((i) => i.href))
    const uniqueHrefs = new Set(hrefs)
    expect(uniqueHrefs.size).toBe(hrefs.length)
  })

  it('should have all hrefs starting with /', () => {
    const hrefs = navigationGroups.flatMap((g) => g.items.map((i) => i.href))
    for (const href of hrefs) {
      expect(href).toMatch(/^\//)
    }
  })

  it('should have label and icon for every item', () => {
    const items = navigationGroups.flatMap((g) => g.items)
    for (const item of items) {
      expect(item.label).toBeTruthy()
      expect(item.icon).toBeDefined()
    }
  })
})
