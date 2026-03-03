'use server'

import { api, handleApiError } from '@/lib/api'

export interface UserNotification {
  id: string
  title: string
  content: string
  readAt: string | null
  createdAt: string
  updatedAt: string | null
}

export interface FetchNotificationsResponse {
  notifications: UserNotification[]
}

export async function fetchNotificationsAction(): Promise<FetchNotificationsResponse> {
  const { response, data } =
    await api<FetchNotificationsResponse>('/notifications')

  handleApiError(response, data, 'Erro ao buscar notificações')

  return data.data!
}
