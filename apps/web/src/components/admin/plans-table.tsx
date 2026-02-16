'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar } from 'lucide-react'
import { formatCurrency } from '@apps/utils'
import type { AdminPlan } from '@/actions/admin/list-plans-admin'
import { PlanActionsDropdown } from './plan-actions-dropdown'

interface PlansTableProps {
  plans: AdminPlan[]
  onEdit: (plan: AdminPlan) => void
  onDelete: (plan: AdminPlan) => void
  onToggleActive: (plan: AdminPlan) => void
}

const cycleLabels: Record<string, string> = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
}

export function PlansTable({
  plans,
  onEdit,
  onDelete,
  onToggleActive,
}: PlansTableProps) {
  if (plans.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border text-muted-foreground">
        Nenhum plano encontrado.
      </div>
    )
  }

  return (
    <>
      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {plan.slug}
                </TableCell>
                <TableCell>{formatCurrency(plan.priceCents)}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {cycleLabels[plan.cycle] ?? plan.cycle}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={plan.active ? 'default' : 'secondary'}>
                    {plan.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PlanActionsDropdown
                    plan={plan}
                    onEdit={() => onEdit(plan)}
                    onDelete={() => onDelete(plan)}
                    onToggleActive={() => onToggleActive(plan)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-3 md:hidden">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{plan.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {plan.slug}
                </p>
              </div>
              <PlanActionsDropdown
                plan={plan}
                onEdit={() => onEdit(plan)}
                onDelete={() => onDelete(plan)}
                onToggleActive={() => onToggleActive(plan)}
              />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span>{formatCurrency(plan.priceCents)}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {cycleLabels[plan.cycle] ?? plan.cycle}
              </Badge>
              <Badge variant={plan.active ? 'default' : 'secondary'}>
                {plan.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Criado em{' '}
                {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
