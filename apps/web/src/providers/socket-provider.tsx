'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { io, type Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { z } from 'zod'

const socketNotificationSchema = z.object({
  data: z.object({
    notification: z.object({
      title: z.string(),
    }),
  }),
})

interface SocketContextValue {
  isConnected: boolean
}

const SocketContext = createContext<SocketContextValue>({ isConnected: false })

export function useSocket() {
  return useContext(SocketContext)
}

interface SocketProviderProps {
  userId: string
  children: ReactNode
}

export function SocketProvider({ userId, children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl || !userId) return

    const socket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('notification', (payload: unknown) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      const parsed = socketNotificationSchema.safeParse(payload)
      if (parsed.success) {
        const title = parsed.data.data.notification.title
        toast.custom((id) => (
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-blue-600 bg-blue-600 px-4 py-3 text-left shadow-lg cursor-pointer"
            onClick={() => {
              toast.dismiss(id)
              window.dispatchEvent(new Event('open-notifications'))
            }}
          >
            <Info className="h-5 w-5 shrink-0 text-white" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Você tem uma nova notificação
              </p>
              <p className="truncate text-sm text-blue-100">{title}</p>
            </div>
          </button>
        ))
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userId, queryClient])

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
