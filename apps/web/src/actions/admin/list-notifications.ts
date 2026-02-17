'use server'

import { api } from '@/lib/api'

export interface AdminNotificationSendId {
  userId: string
  readAt: string | null
}

export interface AdminNotification {
  id: string
  title: string
  content: string
  destination: {
    sendIds: AdminNotificationSendId[]
  }
  createdAt: string
  updatedAt: string | null
}

export interface ListNotificationsParams {
  page?: number
  perPage?: number
}

export interface ListNotificationsResponse {
  notifications: AdminNotification[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export async function listNotificationsAction(
  params: ListNotificationsParams = {},
): Promise<ListNotificationsResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))

  const query = searchParams.toString()
  const endpoint = `/admin/notifications${query ? `?${query}` : ''}`

  const { response, data } = await api<ListNotificationsResponse>(endpoint)

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || data.error || 'Erro ao listar notificações',
    )
  }

  return data.data!
}
