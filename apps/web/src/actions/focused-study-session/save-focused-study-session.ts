'use server'

import { api, handleApiError } from '@/lib/api'
import type {
  FocusedStudySessionItem,
  SaveFocusedStudySessionInput,
} from './types'

export async function saveFocusedStudySessionAction(
  input: SaveFocusedStudySessionInput,
): Promise<FocusedStudySessionItem> {
  const { response, data } = await api<{ session: FocusedStudySessionItem }>(
    '/focused-study-sessions',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )

  handleApiError(response, data, 'Erro ao salvar sessão de estudo')

  return data.data!.session
}
