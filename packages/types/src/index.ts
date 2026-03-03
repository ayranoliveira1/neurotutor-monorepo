// Types and schemas for the Estuda application

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Notification types

export interface UserNotification {
  id: string
  title: string
  content: string
  readAt: string | null
  createdAt: string
  updatedAt: string | null
}

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
