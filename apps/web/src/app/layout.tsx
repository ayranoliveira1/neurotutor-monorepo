import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NeuroTutor',
  description: 'Plataforma de estudos inteligente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
