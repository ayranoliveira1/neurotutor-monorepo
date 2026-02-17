'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  listRatingsAction,
  type ListRatingsParams,
} from '@/actions/admin/list-ratings'

export function useRatingsQuery(params: ListRatingsParams) {
  return useQuery({
    queryKey: ['admin', 'ratings', params],
    queryFn: () => listRatingsAction(params),
    placeholderData: keepPreviousData,
  })
}
