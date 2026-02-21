'use server'

import { redirect } from 'next/navigation'
import { actionClient } from '@/lib/safe-action'
import { signInSchema } from '@/schemas/auth'
import { api, handleApiError, setCookiesFromResponse } from '@/lib/api'

interface SignInResponse {
  success: boolean
  data?: { user: { id: string; name: string; email: string } }
  error?: Array<{ message: string; path?: string[]; code?: string }> | null
}

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<SignInResponse>('/accounts/sign-in', {
      method: 'POST',
      body: JSON.stringify(parsedInput),
      skipAuth: true,
    })

    handleApiError(response, data, 'Credenciais inválidas')

    await setCookiesFromResponse(response)

    redirect('/home')
  })
