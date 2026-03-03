'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface NavigationGuardContextValue {
  isBlocked: boolean
  setBlocked: (v: boolean) => void
  requestNavigation: (proceed: () => void) => void
}

const NavigationGuardContext = createContext<NavigationGuardContextValue>({
  isBlocked: false,
  setBlocked: () => {},
  requestNavigation: (fn) => fn(),
})

export function NavigationGuardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isBlocked, setIsBlocked] = useState(false)
  const [pendingFn, setPendingFn] = useState<(() => void) | null>(null)
  const pathname = usePathname()

  const setBlocked = useCallback((v: boolean) => setIsBlocked(v), [])

  const requestNavigation = useCallback(
    (proceed: () => void) => {
      if (!isBlocked) {
        proceed()
        return
      }
      setPendingFn(() => proceed)
    },
    [isBlocked],
  )

  // Bloqueia botão voltar/avançar do browser
  useEffect(() => {
    if (!isBlocked) return

    // Empurra uma entrada de guarda no histórico para que o botão voltar
    // consuma essa entrada em vez de sair da página
    window.history.pushState(null, '', pathname)

    const handlePopState = () => {
      // A entrada de guarda foi consumida; adiciona uma nova
      window.history.pushState(null, '', pathname)
      setPendingFn(() => () => window.history.go(-2))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isBlocked, pathname])

  const handleConfirm = () => {
    setIsBlocked(false)
    const fn = pendingFn
    setPendingFn(null)
    fn?.()
  }

  return (
    <NavigationGuardContext.Provider
      value={{ isBlocked, setBlocked, requestNavigation }}
    >
      {children}
      <Dialog open={pendingFn !== null}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Sair da sessão de foco?</DialogTitle>
            <DialogDescription>
              O timer está em execução. Se você sair agora, o progresso atual
              será registrado como abandonado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingFn(null)}>
              Continuar estudando
            </Button>
            <Button onClick={handleConfirm}>Sair mesmo assim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NavigationGuardContext.Provider>
  )
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext)
}
