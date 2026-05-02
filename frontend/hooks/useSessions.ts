'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

import type { Session, PaginatedResponse } from '@/types'
 
export function useSessions(params: { groupId?: number; date?: string; status?: string; fromDate?: string; toDate?: string; page?: number } = {}) {
  return useQuery<PaginatedResponse<Session>>({
    queryKey: ['sessions', params],
    queryFn: () =>
      api.get('/sessions', {
        params: {
          group_id:  params.groupId,
          date:      params.date,
          status:    params.status || undefined,
          from_date: params.fromDate,
          to_date:   params.toDate,
          page:      params.page,
        },
      }).then(r => r.data),
    enabled: !!(params.groupId || params.date),
  })
}
 
export function useSession(id: number) {
  return useQuery<{ data: Session }>({
    queryKey: ['sessions', id],
    queryFn: () => api.get(`/sessions/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
 
export function useUpdateSession(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title?: string; status?: string; notes?: string; room?: string }) =>
      api.patch(`/sessions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['sessions', id] })
    },
  })
}