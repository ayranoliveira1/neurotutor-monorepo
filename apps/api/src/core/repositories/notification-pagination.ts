import { Notification } from '@/domain/entreprise/entities/notification'

export interface NotificationPagination {
  notifications: Notification[]
  totalItems: number
  totalPages: number
  currentPage: number
}
