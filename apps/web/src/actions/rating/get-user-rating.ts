'use server'

import { api } from '@/lib/api'

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

  if (!response.ok || !data.success) {
    return null
  }

  return data.data?.rating ?? null
}
