'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

import type { RiskAnalysis, AiQuery } from '@/types'
 
export function useRiskAnalyses(params: { level?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ['risk-analyses', params],
    queryFn: () =>
      api.get('/ai/risk-analyses', {
        params: {
          level: params.level || undefined,
          page:  params.page,
        },
      }).then(r => r.data),
  })
}
 
export function useAnalyzeStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentId: number) =>
      api.post(`/ai/analyze/${studentId}`).then(r => r.data.data as RiskAnalysis),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['risk-analyses'] }),
  })
}
 
export function useAnalyzeAll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/ai/analyze-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['risk-analyses'] }),
  })
}
 
export function useAskAssistant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (question: string) =>
      api.post('/ai/assistant', { question }).then(r => r.data.data as AiQuery),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ai-history'] }),
  })
}
 
export function useAiHistory() {
  return useQuery<{ data: AiQuery[] }>({
    queryKey: ['ai-history'],
    queryFn: () => api.get('/ai/assistant/history').then(r => r.data),
  })
}