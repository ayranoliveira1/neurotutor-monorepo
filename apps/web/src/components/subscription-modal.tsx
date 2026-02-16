'use client'

import { AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function SubscriptionModal() {
  return (
    <Dialog open>
      <DialogContent
        hideCloseButton
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Assinatura Inativa</DialogTitle>
          <DialogDescription className="text-center">
            Sua assinatura não está ativa. Entre em contato com o suporte para
            reativar seu acesso.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
