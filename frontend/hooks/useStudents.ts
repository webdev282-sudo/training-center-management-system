
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Student, CreateStudentForm, PaginatedResponse } from '@/types'

interface StudentsParams {
  page?: number
  search?: string
  status?: string
  courseId?: number
}

export function useStudents(params: StudentsParams = {}) {
  return useQuery<PaginatedResponse<Student>>({
    queryKey: ['students', params],
    queryFn: () =>
      api.get('/students', {
        params: {
          page: params.page,
          search: params.search || undefined,
          status: params.status || undefined,
          course_id: params.courseId,
        },
      }).then((r) => r.data),
  })
}

export function useStudent(id: number) {
  return useQuery<{ data: Student }>({
    queryKey: ['students', id],
    queryFn: () => api.get(`/students/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStudentForm) => api.post('/students', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useUpdateStudent(id: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CreateStudentForm>) =>
      api.put(`/students/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['students', id] })
    },
  })
}

export function useArchiveStudent() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.patch(`/students/${id}/archive`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useStudentNotes(studentId: number) {
  return useQuery({
    queryKey: ['student-notes', studentId],
    queryFn: () =>
      api.get(`/students/${studentId}/notes`).then((r) => r.data.data),
    enabled: !!studentId,
  })
}

export function useAddStudentNote(studentId: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (content: string) =>
      api.post(`/students/${studentId}/notes`, { content }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['student-notes', studentId] }),
  })
}