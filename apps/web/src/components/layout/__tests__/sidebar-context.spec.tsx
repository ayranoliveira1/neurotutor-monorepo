import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSidebar, SidebarProvider } from '../sidebar-context'

describe('useSidebar', () => {
  it('should throw when used outside SidebarProvider', () => {
    expect(() => renderHook(() => useSidebar())).toThrow(
      'useSidebar must be used within a SidebarProvider'
    )
  })

  it('should return context when used inside SidebarProvider', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    })

    expect(result.current.collapsed).toBe(false)
    expect(typeof result.current.toggleCollapsed).toBe('function')
  })
})
