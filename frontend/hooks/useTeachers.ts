'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Teacher, PaginatedResponse } from '@/types'
 
export function useTeachers(params: { search?: string; status?: boolean } = {}) {
  return useQuery<PaginatedResponse<Teacher>>({
    queryKey: ['teachers', params],
    queryFn: () =>
      api.get('/teachers', {
        params: {
          search: params.search || undefined,
          status: params.status,
        },
      }).then(r => r.data),
  })
}
 
export function useCreateTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { full_name: string; phone: string; email?: string; specialty?: string }) =>
      api.post('/teachers', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  })
}
 
export function useToggleTeacherStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/teachers/${id}/toggle-status`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  })
}