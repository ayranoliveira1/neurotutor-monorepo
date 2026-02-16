import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface SubmitButtonProps {
  isPending: boolean
  label: string
  pendingLabel: string
}

export function SubmitButton({
  isPending,
  label,
  pendingLabel,
}: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {isPending ? pendingLabel : label}
    </Button>
  )
}
