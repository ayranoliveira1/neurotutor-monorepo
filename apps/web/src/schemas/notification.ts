import { z } from 'zod'

export const adminCreateNotificationSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Título é obrigatório')
      .min(3, 'Título deve ter no mínimo 3 caracteres'),
    message: z
      .string()
      .min(1, 'Mensagem é obrigatória')
      .min(3, 'Mensagem deve ter no mínimo 3 caracteres'),
    sendToAll: z.boolean().default(false),
    sendIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => data.sendToAll || (data.sendIds && data.sendIds.length > 0),
    {
      message: 'Selecione pelo menos um destinatário',
      path: ['sendIds'],
    },
  )

export type AdminCreateNotificationInput = z.infer<
  typeof adminCreateNotificationSchema
>
