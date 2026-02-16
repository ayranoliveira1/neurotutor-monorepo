import { Brain } from 'lucide-react'
import { AuthBrandingPanel } from '@/components/auth/auth-branding-panel'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(420px,1.2fr)_3fr]">
      {/* Left side: Form area */}
      <div className="flex flex-col items-center justify-center px-6 py-8 sm:px-8 lg:px-12">
        {/* Mobile-only header */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground">
            NeuroTutor
          </span>
        </div>

        <div className="w-full max-w-110 space-y-6">{children}</div>

        {/* Mobile-only footer */}
        <p className="mt-12 text-center text-xs text-muted-foreground lg:hidden">
          &copy; {new Date().getFullYear()} NeuroTutor. Todos os direitos
          reservados.
        </p>
      </div>

      {/* Right side: Branding panel */}
      <AuthBrandingPanel />
    </main>
  )
}
