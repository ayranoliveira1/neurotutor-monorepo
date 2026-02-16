'use client'

import { useState } from 'react'
import { type UseFormRegisterReturn } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface AuthFormFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  error?: string
  registration: UseFormRegisterReturn
}

export function AuthFormField({
  id,
  label,
  type,
  placeholder,
  error,
  registration,
}: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={isPassword ? 'pr-10' : undefined}
          {...registration}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
