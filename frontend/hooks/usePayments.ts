'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

import type { Payment, AddInstallmentForm, PaginatedResponse } from '@/types'
 
export function usePayments(params: { status?: string; studentId?: number; page?: number } = {}) {
  return useQuery<PaginatedResponse<Payment>>({
    queryKey: ['payments', params],
    queryFn: () =>
      api.get('/payments', {
        params: {
          status:     params.status || undefined,
          student_id: params.studentId,
          page:       params.page,
        },
      }).then(r => r.data),
  })
}
 
export function usePayment(id: number) {
  return useQuery<{ data: Payment }>({
    queryKey: ['payments', id],
    queryFn: () => api.get(`/payments/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
 
export function useAddInstallment(paymentId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddInstallmentForm) =>
      api.post(`/payments/${paymentId}/installments`, {
        amount:   data.amount,
        due_date: data.due_date,
        note:     data.note,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] })
      qc.invalidateQueries({ queryKey: ['dashboard-kpis'] })
      qc.invalidateQueries({ queryKey: ['dashboard-overdue'] })
    },
  })
}