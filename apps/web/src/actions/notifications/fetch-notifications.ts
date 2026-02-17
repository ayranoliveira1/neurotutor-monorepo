'use server'

import { api } from '@/lib/api'

export interface NotificationSendId {
  userId: string
  readAt: string | null
}

export interface UserNotification {
  id: string
  title: string
  content: string
  destination: {
    sendIds: NotificationSendId[]
  }
  createdAt: string
  updatedAt: string | null
}

export interface FetchNotificationsResponse {
  notifications: UserNotification[]
}

export async function fetchNotificationsAction(): Promise<FetchNotificationsResponse> {
  const { response, data } =
    await api<FetchNotificationsResponse>('/notifications')

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || data.error || 'Erro ao buscar notificações',
    )
  }

  return data.data!
}
