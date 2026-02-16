'use client'

import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSidebar } from './sidebar-context'
import { SidebarNavContent } from './sidebar-nav-content'

export function MobileSidebar() {
  const pathname = usePathname()
  const { mobileOpen, setMobileOpen } = useSidebar()

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 p-0" aria-describedby={undefined}>
        <SheetHeader className="sr-only">
          <SheetTitle>Menu de navegação</SheetTitle>
        </SheetHeader>
        <SidebarNavContent
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
