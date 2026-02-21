'use client'

import { MoreHorizontal, Pencil, Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { AdminPlan } from '@/actions/admin/planos/list-plans-admin'

interface PlanActionsDropdownProps {
  plan: AdminPlan
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}

export function PlanActionsDropdown({
  plan,
  onEdit,
  onDelete,
  onToggleActive,
}: PlanActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Ações de ${plan.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        {!plan.active ? (
          <DropdownMenuItem onClick={onToggleActive}>
            <Power className="mr-2 h-4 w-4" />
            Ativar
          </DropdownMenuItem>
        ) : plan.canDelete ? null : (
          <DropdownMenuItem onClick={onToggleActive}>
            <PowerOff className="mr-2 h-4 w-4" />
            Inativar
          </DropdownMenuItem>
        )}
        {plan.canDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
