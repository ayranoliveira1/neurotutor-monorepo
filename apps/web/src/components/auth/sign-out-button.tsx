'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/actions/auth/sign-out'

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </form>
  )
}
