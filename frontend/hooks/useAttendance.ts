
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Attendance, AttendanceRecord } from '@/types'
 
export function useAttendance(params: { sessionId?: number; groupId?: number; date?: string } = {}) {
  return useQuery<{ data: Attendance[] }>({
    queryKey: ['attendance', params],
    queryFn: () =>
      api.get('/attendance', {
        params: {
          session_id: params.sessionId,
          group_id:   params.groupId,
          date:       params.date,
        },
      }).then(r => r.data),
    enabled: !!(params.sessionId || params.groupId),
  })
}
 
export function useBulkRecordAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sessionId, records }: { sessionId: number; records: AttendanceRecord[] }) =>
      api.post('/attendance/bulk', {
        session_id: sessionId,
        records: records.map(r => ({
          student_id: r.studentId,
          status:     r.status,
          time_in:    r.timeIn,
          time_out:   r.timeOut,
          note:       r.note,
        })),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] })
      qc.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}
 