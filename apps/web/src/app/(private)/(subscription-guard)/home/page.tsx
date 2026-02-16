import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | NeuroTutor',
}

export default function HomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Home</h2>
      <p className="text-muted-foreground">
        Bem-vindo ao seu painel de estudos.
      </p>
    </div>
  )
}
