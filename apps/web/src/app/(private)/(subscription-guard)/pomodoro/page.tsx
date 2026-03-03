import type { Metadata } from 'next'
import { PomodoroPageContent } from '@/components/pomodoro/pomodoro-page-content'

export const metadata: Metadata = {
  title: 'Modo Foco | NeuroTutor',
}

export default function PomodoroPage() {
  return <PomodoroPageContent />
}
