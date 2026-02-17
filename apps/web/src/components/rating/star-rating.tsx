'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  disabled?: boolean
  size?: number
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  size = 24,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const displayValue = hoverValue || value

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Avaliação">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          disabled={disabled}
          className={cn(
            'transition-colors',
            disabled ? 'cursor-default' : 'cursor-pointer'
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => !disabled && setHoverValue(0)}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              star <= displayValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-yellow-400/90'
            )}
          />
        </button>
      ))}
    </div>
  )
}
