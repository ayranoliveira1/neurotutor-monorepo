import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDraggable } from '../use-draggable'

function makeDragEvent(overrides: { target?: HTMLElement } = {}) {
  const div = document.createElement('div')
  return {
    clientX: 50,
    clientY: 50,
    target: overrides.target ?? div,
    currentTarget: div,
    ...({
      getBoundingClientRect: undefined,
    } as Record<string, unknown>),
    get currentTargetRect() {
      return undefined
    },
  } as unknown as React.PointerEvent
}

function makePointerEvent(target?: HTMLElement) {
  const container = document.createElement('div')
  Object.defineProperty(container, 'getBoundingClientRect', {
    value: () => ({ left: 0, top: 0, width: 200, height: 200 }),
  })
  return {
    clientX: 50,
    clientY: 50,
    target: target ?? container,
    currentTarget: container,
  } as unknown as React.PointerEvent
}

describe('useDraggable', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })
  })

  it('deve inicializar com posição padrão (0,0)', () => {
    const { result } = renderHook(() => useDraggable())
    expect(result.current.position).toEqual({ x: 0, y: 0 })
    expect(result.current.isDragging).toBe(false)
  })

  it('deve inicializar com posição customizada', () => {
    const { result } = renderHook(() =>
      useDraggable({ initialPosition: { x: 100, y: 200 } }),
    )
    expect(result.current.position).toEqual({ x: 100, y: 200 })
  })

  it('deve definir isDragging como true ao iniciar drag', () => {
    const { result } = renderHook(() => useDraggable())

    act(() => {
      result.current.handlePointerDown(makePointerEvent())
    })

    expect(result.current.isDragging).toBe(true)
  })

  it('deve atualizar posição em pointermove', () => {
    const { result } = renderHook(() => useDraggable())

    act(() => {
      result.current.handlePointerDown(makePointerEvent())
    })

    act(() => {
      document.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 150, clientY: 150 }),
      )
    })

    expect(result.current.position.x).toBe(100)
    expect(result.current.position.y).toBe(100)
  })

  it('deve limitar posição ao viewport', () => {
    const { result } = renderHook(() => useDraggable())

    act(() => {
      result.current.handlePointerDown(makePointerEvent())
    })

    act(() => {
      document.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 2000, clientY: 2000 }),
      )
    })

    // Should be clamped: max x = 1024 - 200 = 824, max y = 768 - 200 = 568
    expect(result.current.position.x).toBe(824)
    expect(result.current.position.y).toBe(568)
  })

  it('deve parar de arrastar no pointerup', () => {
    const { result } = renderHook(() => useDraggable())

    act(() => {
      result.current.handlePointerDown(makePointerEvent())
    })

    expect(result.current.isDragging).toBe(true)

    act(() => {
      document.dispatchEvent(new PointerEvent('pointerup'))
    })

    expect(result.current.isDragging).toBe(false)
  })

  it('não deve iniciar drag quando target é um botão', () => {
    const { result } = renderHook(() => useDraggable())

    const button = document.createElement('button')
    const container = document.createElement('div')
    container.appendChild(button)

    act(() => {
      const event = {
        clientX: 50,
        clientY: 50,
        target: button,
        currentTarget: container,
      } as unknown as React.PointerEvent
      result.current.handlePointerDown(event)
    })

    expect(result.current.isDragging).toBe(false)
  })

  it('não deve iniciar drag quando target está dentro de um link', () => {
    const { result } = renderHook(() => useDraggable())

    const link = document.createElement('a')
    const span = document.createElement('span')
    link.appendChild(span)
    const container = document.createElement('div')
    container.appendChild(link)

    act(() => {
      const event = {
        clientX: 50,
        clientY: 50,
        target: span,
        currentTarget: container,
      } as unknown as React.PointerEvent
      result.current.handlePointerDown(event)
    })

    expect(result.current.isDragging).toBe(false)
  })
})
