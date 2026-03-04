import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PomodoroTimer } from '../pomodoro-timer'
import type { Phase } from '@/hooks/use-pomodoro-timer'

describe('PomodoroTimer', () => {
  it('deve renderizar MM:SS corretamente', () => {
    render(
      <PomodoroTimer
        secondsLeft={25 * 60}
        totalSeconds={25 * 60}
        phase="IDLE"
      />,
    )
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('deve formatar tempo corretamente (ex: 4:05)', () => {
    render(
      <PomodoroTimer
        secondsLeft={245}
        totalSeconds={25 * 60}
        phase="WORK"
      />,
    )
    expect(screen.getByText('04:05')).toBeInTheDocument()
  })

  it('deve exibir rótulo da fase WORK', () => {
    render(
      <PomodoroTimer secondsLeft={1500} totalSeconds={1500} phase="WORK" />,
    )
    expect(screen.getByText('Foco')).toBeInTheDocument()
  })

  it('deve exibir rótulo da fase SHORT_BREAK', () => {
    render(
      <PomodoroTimer
        secondsLeft={300}
        totalSeconds={300}
        phase="SHORT_BREAK"
      />,
    )
    expect(screen.getByText('Pausa Curta')).toBeInTheDocument()
  })

  it('deve exibir rótulo da fase LONG_BREAK', () => {
    render(
      <PomodoroTimer
        secondsLeft={900}
        totalSeconds={900}
        phase="LONG_BREAK"
      />,
    )
    expect(screen.getByText('Pausa Longa')).toBeInTheDocument()
  })

  it('deve renderizar anel SVG com stroke-dashoffset', () => {
    render(
      <PomodoroTimer secondsLeft={750} totalSeconds={1500} phase="WORK" />,
    )
    const circles = document.querySelectorAll('circle')
    // Second circle is the progress ring
    const progressCircle = circles[1]
    expect(progressCircle).toHaveAttribute('stroke-dashoffset')
  })

  it('deve renderizar no modo compact com SVG menor', () => {
    render(
      <PomodoroTimer
        secondsLeft={1500}
        totalSeconds={1500}
        phase="WORK"
        size="compact"
      />,
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('width', '100')
    expect(svg).toHaveAttribute('height', '100')
  })

  it('não deve exibir rótulo da fase no modo compact', () => {
    render(
      <PomodoroTimer
        secondsLeft={1500}
        totalSeconds={1500}
        phase="WORK"
        size="compact"
      />,
    )
    expect(screen.queryByText('Foco')).not.toBeInTheDocument()
  })

  it('deve exibir rótulo da fase no modo default', () => {
    render(
      <PomodoroTimer
        secondsLeft={1500}
        totalSeconds={1500}
        phase="WORK"
        size="default"
      />,
    )
    expect(screen.getByText('Foco')).toBeInTheDocument()
  })
})
