import { describe, it, expect } from 'vitest'
import { adminCreateNotificationSchema } from '../notification'

describe('adminCreateNotificationSchema', () => {
  it('deve validar notificação para todos', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Nova funcionalidade',
      message: 'Confira as novidades da plataforma',
      sendToAll: true,
    })

    expect(result.success).toBe(true)
  })

  it('deve validar notificação para IDs específicos', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Aviso importante',
      message: 'Mensagem personalizada',
      sendToAll: false,
      sendIds: ['user-1', 'user-2'],
    })

    expect(result.success).toBe(true)
  })

  it('deve rejeitar título vazio', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: '',
      message: 'Mensagem válida',
      sendToAll: true,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Título é obrigatório')
  })

  it('deve rejeitar título com menos de 3 caracteres', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'AB',
      message: 'Mensagem válida',
      sendToAll: true,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Título deve ter no mínimo 3 caracteres',
    )
  })

  it('deve rejeitar mensagem vazia', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Título válido',
      message: '',
      sendToAll: true,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Mensagem é obrigatória')
  })

  it('deve rejeitar mensagem com menos de 3 caracteres', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Título válido',
      message: 'AB',
      sendToAll: true,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Mensagem deve ter no mínimo 3 caracteres',
    )
  })

  it('deve rejeitar quando sendToAll é false e sendIds está vazio', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Título válido',
      message: 'Mensagem válida',
      sendToAll: false,
      sendIds: [],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Selecione pelo menos um destinatário',
    )
  })

  it('deve rejeitar quando sendToAll é false e sendIds não é fornecido', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Título válido',
      message: 'Mensagem válida',
      sendToAll: false,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Selecione pelo menos um destinatário',
    )
  })

  it('deve aplicar default false para sendToAll', () => {
    const result = adminCreateNotificationSchema.safeParse({
      title: 'Título válido',
      message: 'Mensagem válida',
      sendIds: ['user-1'],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sendToAll).toBe(false)
    }
  })
})
