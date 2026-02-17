import { describe, it, expect } from 'vitest'
import { navigationGroups, getNavigationGroups } from '../navigation'

describe('navigationGroups', () => {
  it('should have 2 groups', () => {
    expect(navigationGroups).toHaveLength(2)
  })

  it('should have correct group titles', () => {
    const titles = navigationGroups.map((g) => g.title)
    expect(titles).toEqual(['Menu', 'Administração'])
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

describe('getNavigationGroups', () => {
  it('should return only non-admin groups for STUDENT role', () => {
    const groups = getNavigationGroups('STUDENT')
    expect(groups.every((g) => !g.adminOnly)).toBe(true)
    expect(groups).toHaveLength(1)
  })

  it('should return all groups for ADMIN role', () => {
    const groups = getNavigationGroups('ADMIN')
    expect(groups).toHaveLength(2)
  })

  it('should return only non-admin groups for null role', () => {
    const groups = getNavigationGroups(null)
    expect(groups.every((g) => !g.adminOnly)).toBe(true)
  })
})
