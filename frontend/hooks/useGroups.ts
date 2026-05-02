'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Group, CreateGroupForm, PaginatedResponse } from '@/types'
 
interface GroupsParams { status?: string; courseId?: number; teacherId?: number; search?: string }
 
export function useGroups(params: GroupsParams = {}) {
  return useQuery<PaginatedResponse<Group>>({
    queryKey: ['groups', params],
    queryFn: () =>
      api.get('/groups', {
        params: {
          status:     params.status || undefined,
          course_id:  params.courseId,
          teacher_id: params.teacherId,
          search:     params.search || undefined,
        },
      }).then(r => r.data),
  })
}
 
export function useGroup(id: number) {
  return useQuery<{ data: Group }>({
    queryKey: ['groups', id],
    queryFn: () => api.get(`/groups/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
 
export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGroupForm) => api.post('/groups', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}
 
export function useUpdateGroup(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateGroupForm>) => api.put(`/groups/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] })
      qc.invalidateQueries({ queryKey: ['groups', id] })
    },
  })
}
 
export function useCompleteGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/groups/${id}/complete`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}
 
export function useGenerateSessions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (groupId: number) => api.post(`/groups/${groupId}/generate-sessions`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  })
}
 
export function useEnrollStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, groupId }: { studentId: number; groupId: number }) =>
      api.post('/enrollments', { student_id: studentId, group_id: groupId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['groups'] })
      qc.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}