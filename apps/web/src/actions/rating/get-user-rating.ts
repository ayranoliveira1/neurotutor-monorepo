'use server'

import { api, handleApiError } from '@/lib/api'

export interface UserRating {
  id: string
  userId: string
  rating: number
  description: string
  createdAt: string
}

interface GetUserRatingResponse {
  rating: UserRating | null
}

export async function getUserRating(): Promise<UserRating | null> {
  const { response, data } = await api<GetUserRatingResponse>('/ratings/me')

  handleApiError(response, data, 'Erro ao obter avaliação do usuário')

  return data.data?.rating ?? null
}
