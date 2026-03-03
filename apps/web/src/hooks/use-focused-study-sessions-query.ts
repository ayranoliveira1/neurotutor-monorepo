'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchFocusedStudySessionsAction,
  fetchFocusedStudySessionsStatsAction,
} from '@/actions/focused-study-session/fetch-focused-study-sessions'

export function useFocusedStudySessionsStatsQuery(params: {
  startDate: Date
  endDate: Date
}) {
  return useQuery({
    queryKey: [
      'focused-study-sessions',
      'stats',
      params.startDate.toISOString(),
      params.endDate.toISOString(),
    ],
    queryFn: () => fetchFocusedStudySessionsStatsAction(params),
  })
}

export function useFocusedStudySessionsQuery(
  params: { page?: number; perPage?: number } = {},
) {
  return useQuery({
    queryKey: ['focused-study-sessions', params],
    queryFn: () => fetchFocusedStudySessionsAction(params),
  })
}
