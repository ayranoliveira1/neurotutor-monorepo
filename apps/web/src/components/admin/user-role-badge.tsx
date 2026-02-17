import { Badge } from '@/components/ui/badge'

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  STUDENT: 'Aluno',
  TEACHER: 'Professor',
}

const roleVariants: Record<string, 'default' | 'secondary' | 'destructive'> = {
  ADMIN: 'destructive',
  STUDENT: 'default',
  TEACHER: 'secondary',
}

export function UserRoleBadge({ role }: { role: string | null }) {
  if (!role) return <Badge variant="outline">Sem papel</Badge>

  return (
    <Badge variant={roleVariants[role] ?? 'default'}>
      {roleLabels[role] ?? role}
    </Badge>
  )
}
