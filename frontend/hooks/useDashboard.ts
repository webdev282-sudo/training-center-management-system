import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { DashboardKpis, Payment, PaginatedResponse } from '@/types'

 
export function useDashboardKpis() {
  return useQuery<{ data: DashboardKpis }>({
    queryKey: ['dashboard-kpis'],
    queryFn: () => api.get('/dashboard/kpis').then(r => r.data),
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
 
export function useOverduePayments() {
  return useQuery<{ data: Payment[] }>({
    queryKey: ['dashboard-overdue'],
    queryFn: () => api.get('/dashboard/overdue-payments').then(r => r.data),
    refetchInterval: 120_000,
  })
}