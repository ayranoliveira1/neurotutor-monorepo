'use client'

import { cn } from '@/lib/utils'
import { Volume2, VolumeX } from 'lucide-react'
import { type AmbientSound } from '@/hooks/use-pomodoro-sound'

interface SoundOption {
  value: AmbientSound
  label: string
}

const SOUND_OPTIONS: SoundOption[] = [
  { value: 'none', label: 'Nenhum' },
  { value: 'rain', label: 'Chuva' },
  { value: 'cafe', label: 'Café' },
  { value: 'library', label: 'Biblioteca' },
]

interface PomodoroSoundSelectorProps {
  selected: AmbientSound
  onSelect: (sound: AmbientSound) => void
}

export function PomodoroSoundSelector({
  selected,
  onSelect,
}: PomodoroSoundSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
        <Volume2 className="size-4" />
        Som ambiente
      </p>
      <div className="flex flex-wrap gap-2">
        {SOUND_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              selected === opt.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted',
            )}
            aria-pressed={selected === opt.value}
          >
            {opt.value === 'none' && <VolumeX className="mr-1 inline size-3" />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
