'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseDraggableOptions {
  initialPosition?: { x: number; y: number }
}

interface UseDraggableReturn {
  position: { x: number; y: number }
  handlePointerDown: (e: React.PointerEvent) => void
  isDragging: boolean
}

const INTERACTIVE_SELECTORS = 'button, a, input, [role="button"]'

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.closest(INTERACTIVE_SELECTORS) !== null
}

export function useDraggable(
  options: UseDraggableOptions = {}
): UseDraggableReturn {
  const { initialPosition = { x: 0, y: 0 } } = options
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const offsetRef = useRef({ x: 0, y: 0 })
  const elementSizeRef = useRef({ width: 0, height: 0 })

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const newX = e.clientX - offsetRef.current.x
    const newY = e.clientY - offsetRef.current.y

    const maxX = window.innerWidth - elementSizeRef.current.width
    const maxY = window.innerHeight - elementSizeRef.current.height

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }, [])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isInteractiveElement(e.target)) return

      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      elementSizeRef.current = { width: rect.width, height: rect.height }
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      setIsDragging(true)
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    },
    [handlePointerMove, handlePointerUp]
  )

  return { position, handlePointerDown, isDragging }
}
