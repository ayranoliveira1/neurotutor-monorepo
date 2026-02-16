'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOutAction() {
  const cookieStore = await cookies()

  try {
    cookieStore.delete({ name: 'session_token', path: '/' })
  } catch {
    // Cookie may not exist
  }

  redirect('/login')
}
