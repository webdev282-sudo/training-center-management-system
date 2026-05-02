'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

import type { Course, CreateCourseForm, Domain, PaginatedResponse } from '@/types'
 
export function useCourses(params: { domainId?: number; status?: boolean; level?: string; search?: string } = {}) {
  return useQuery<PaginatedResponse<Course>>({
    queryKey: ['courses', params],
    queryFn: () =>
      api.get('/courses', {
        params: {
          domain_id: params.domainId,
          status:    params.status,
          level:     params.level || undefined,
          search:    params.search || undefined,
        },
      }).then(r => r.data),
  })
}
 
export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCourseForm) => api.post('/courses', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}
 
export function useToggleCourseStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/courses/${id}/toggle-status`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}
 
export function useDomains() {
  return useQuery<{ data: Domain[] }>({
    queryKey: ['domains'],
    queryFn: () => api.get('/domains').then(r => r.data),
  })
}
 
export function useCreateDomain() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => api.post('/domains', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['domains'] }),
  })
}