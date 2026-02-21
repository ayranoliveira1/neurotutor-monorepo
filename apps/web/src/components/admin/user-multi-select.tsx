'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { X, Search, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { listUsersAction } from '@/actions/admin/usuarios/list-users'
import type { AdminUser } from '@/actions/admin/usuarios/list-users'

interface UserMultiSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
}

export function UserMultiSelect({ value, onChange }: UserMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const result = await listUsersAction({
          search: debouncedSearch || undefined,
          perPage: 20,
        })
        setUsers(result.users)
      } catch {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchUsers()
    }
  }, [debouncedSearch, open])

  function toggleUser(userId: string) {
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId))
    } else {
      onChange([...value, userId])
    }
  }

  function removeUser(userId: string) {
    onChange(value.filter((id) => id !== userId))
  }

  const selectedUsers = users.filter((u) => value.includes(u.id))
  const selectedNames = selectedUsers.reduce<Record<string, string>>(
    (acc, u) => {
      acc[u.id] = u.name
      return acc
    },
    {},
  )

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((id) => (
            <Badge key={id} variant="secondary" className="gap-1">
              {selectedNames[id] || id.slice(0, 8)}
              <button
                type="button"
                onClick={() => removeUser(id)}
                className="rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent"
          >
            <span className="text-muted-foreground">
              {value.length > 0
                ? `${value.length} selecionado${value.length !== 1 ? 's' : ''}`
                : 'Selecionar usuários'}
            </span>
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" side="top">
          <div className="border-b p-2">
            <Input
              ref={inputRef}
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <div
            className="max-h-40 overflow-y-auto overscroll-contain p-1"
            onWheel={(e) => {
              e.currentTarget.scrollTop += e.deltaY
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum usuário encontrado
              </p>
            ) : (
              users.map((user) => {
                const isSelected = value.includes(user.id)
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user.id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
