'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  listNotificationsAction,
  type ListNotificationsParams,
} from '@/actions/admin/notificacoes/list-notifications'

export function useNotificationsAdminQuery(params: ListNotificationsParams) {
  return useQuery({
    queryKey: ['admin', 'notifications', params],
    queryFn: () => listNotificationsAction(params),
    placeholderData: keepPreviousData,
  })
}
