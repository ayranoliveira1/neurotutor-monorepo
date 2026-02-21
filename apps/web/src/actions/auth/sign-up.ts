'use server'

import { redirect } from 'next/navigation'
import { actionClient } from '@/lib/safe-action'
import { signUpSchema } from '@/schemas/auth'
import { api, handleApiError } from '@/lib/api'

interface SignUpResponse {
  success: boolean
  data?: { user: { id: string; name: string; email: string } }
  error?: Array<{ message: string; path?: string[]; code?: string }> | null
}

export const signUpAction = actionClient
  .inputSchema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<SignUpResponse>('/accounts/sign-up', {
      method: 'POST',
      body: JSON.stringify(parsedInput),
      skipAuth: true,
    })

    handleApiError(response, data, 'Erro ao criar conta')

    redirect('/login')
  })
