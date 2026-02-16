'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Selecione o período',
  className,
}: DateRangePickerProps) {
  function handleSelect(range: DateRange | undefined) {
    // react-day-picker v9 expande o range existente ao clicar.
    // Queremos que, após um range completo, o próximo clique inicie nova seleção.
    if (value?.from && value?.to && range?.from && range?.to) {
      const fromChanged = range.from.getTime() !== value.from.getTime()
      const toChanged = range.to.getTime() !== value.to.getTime()
      const clickedDate = fromChanged
        ? range.from
        : toChanged
          ? range.to
          : range.from
      onChange?.({ from: clickedDate, to: undefined })
      return
    }

    onChange?.(range)
  }

  const calendarProps = {
    mode: 'range' as const,
    defaultMonth: value?.from,
    selected: value,
    onSelect: handleSelect,
    locale: ptBR,
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal w-full sm:w-70',
            !value?.from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                  {format(value.to, 'dd/MM/yyyy', { locale: ptBR })}
                </>
              ) : (
                format(value.from, 'dd/MM/yyyy', { locale: ptBR })
              )
            ) : (
              placeholder
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...calendarProps}
          numberOfMonths={2}
          className="hidden sm:block"
        />
        <Calendar
          {...calendarProps}
          numberOfMonths={1}
          className="block sm:hidden"
        />
      </PopoverContent>
    </Popover>
  )
}
