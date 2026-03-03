'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type PomodoroSettings } from '@/hooks/use-pomodoro-timer'

interface PomodoroSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: PomodoroSettings
  onSave: (settings: PomodoroSettings) => void
}

export function PomodoroSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: PomodoroSettingsDialogProps) {
  const [values, setValues] = useState(settings)

  const handleChange = (key: keyof PomodoroSettings) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = Number(e.target.value)
    if (!isNaN(val) && val > 0) {
      setValues((prev) => ({ ...prev, [key]: val }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Configurações do Pomodoro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workMins">Tempo de foco (min)</Label>
            <Input
              id="workMins"
              type="number"
              min={1}
              max={120}
              value={values.workMins}
              onChange={handleChange('workMins')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortBreakMins">Pausa curta (min)</Label>
            <Input
              id="shortBreakMins"
              type="number"
              min={1}
              max={60}
              value={values.shortBreakMins}
              onChange={handleChange('shortBreakMins')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreakMins">Pausa longa (min)</Label>
            <Input
              id="longBreakMins"
              type="number"
              min={1}
              max={60}
              value={values.longBreakMins}
              onChange={handleChange('longBreakMins')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cyclesBeforeLong">Ciclos até pausa longa</Label>
            <Input
              id="cyclesBeforeLong"
              type="number"
              min={1}
              max={10}
              value={values.cyclesBeforeLong}
              onChange={handleChange('cyclesBeforeLong')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Meta diária de pomodoros</Label>
            <Input
              id="dailyGoal"
              type="number"
              min={1}
              max={100}
              value={values.dailyGoal}
              onChange={handleChange('dailyGoal')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
