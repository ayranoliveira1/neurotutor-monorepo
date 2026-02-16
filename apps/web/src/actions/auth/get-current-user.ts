'use server'

import { cookies } from 'next/headers'
import { api } from '@/lib/api'

export interface Subscription {
  id: string
  userId: string
  planId: string
  planName: string
  externalId?: string
  startDate: string
  endDate: string
  metadata: string
  active: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  cpfCnpj?: string
  phone?: string
  address?: string
  addressNumber?: string
  province?: string
  postalCode?: string
  image: string | null
  role: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  subscription: Subscription | null
}

interface MeResponse {
  user: User
}

export type GetCurrentUserResult =
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' }
  | { status: 'error'; message: string }

async function clearSessionCookies() {
  const cookieStore = await cookies()
  const cookieNames = ['session_token']
  for (const name of cookieNames) {
    try {
      cookieStore.delete({ name, path: '/' })
    } catch {
      // Ignore errors when trying to delete cookies
    }
  }
}

export async function getCurrentUser(): Promise<GetCurrentUserResult> {
  const cookieStore = await cookies()

  const sessionCookie = cookieStore.get('session_token')

  if (!sessionCookie) {
    return { status: 'unauthenticated' }
  }

  try {
    const { response, data } = await api<MeResponse>('/accounts/me', {
      method: 'GET',
    })

    if (!response.ok || !data.success) {
      await clearSessionCookies()
      return { status: 'unauthenticated' }
    }

    const user = data.data?.user
    console.log('Current user:', user)
    if (!user) {
      await clearSessionCookies()
      return { status: 'unauthenticated' }
    }

    return { status: 'authenticated', user }
  } catch {
    await clearSessionCookies()
    return { status: 'error', message: 'Erro de conexão com o servidor' }
  }
}
