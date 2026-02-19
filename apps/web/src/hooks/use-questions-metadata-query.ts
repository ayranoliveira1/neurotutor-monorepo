'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchSubjectsAction } from '@/actions/exercise-list/fetch-subjects'
import { fetchOriginsAction } from '@/actions/exercise-list/fetch-origins'
import { fetchCategoriesAction } from '@/actions/exercise-list/fetch-categories'
import { fetchYearsAction } from '@/actions/exercise-list/fetch-years'
import { fetchDifficultiesAction } from '@/actions/exercise-list/fetch-difficulties'

export function useSubjectsQuery() {
  return useQuery({
    queryKey: ['questions', 'subjects'],
    queryFn: () => fetchSubjectsAction(),
  })
}

export function useOriginsQuery() {
  return useQuery({
    queryKey: ['questions', 'origins'],
    queryFn: () => fetchOriginsAction(),
  })
}

export function useCategoriesQuery(subject?: string) {
  return useQuery({
    queryKey: ['questions', 'categories', subject],
    queryFn: () => fetchCategoriesAction(subject),
    enabled: !!subject,
  })
}

export function useYearsQuery() {
  return useQuery({
    queryKey: ['questions', 'years'],
    queryFn: () => fetchYearsAction(),
  })
}

export function useDifficultiesQuery() {
  return useQuery({
    queryKey: ['questions', 'difficulties'],
    queryFn: () => fetchDifficultiesAction(),
  })
}
