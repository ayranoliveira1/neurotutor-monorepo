import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'

import { RegisterForm } from '@/components/auth/register-form'
import { getCurrentUser } from '@/actions/auth/get-current-user'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Cadastre-se | NeuroTutor',
}

export default async function RegisterPage() {
  const result = await getCurrentUser()

  if (result.status === 'authenticated') {
    redirect('/home')
  }

  return (
    <>
      <div className="space-y-3 text-center lg:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Zap className="h-3 w-3" />
          Comece agora, é grátis
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Crie sua conta
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Milhares de estudantes já transformaram seus resultados. Sua vez
          chegou.
        </p>
      </div>

      <RegisterForm />

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
          ou
        </span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </>
  )
}
