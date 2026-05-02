// ============================================================
// components/students/StudentTable.tsx
// ============================================================
'use client'
import { useState } from 'react'
import { useStudents, useArchiveStudent } from '@/hooks/useStudents'
import { PaymentBadge, StudentStatusBadge } from '@/components/ui/StatusBadge'
import type { Student } from '@/types'
 
interface Props {
  onSelect?: (student: Student) => void
}
 
export function StudentTable({ onSelect }: Props) {
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('')
  const [page, setPage]       = useState(1)
 
  const { data, isLoading }   = useStudents({ search, status, page })
  const archiveMutation       = useArchiveStudent()
 
  if (isLoading) return <TableSkeleton />
 
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Filters */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <input
          type="search"
          placeholder="Rechercher un étudiant..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="completed">Terminés</option>
          <option value="archived">Archivés</option>
        </select>
      </div>
 
      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <th className="text-left px-4 py-3">Code</th>
            <th className="text-left px-4 py-3">Nom</th>
            <th className="text-left px-4 py-3">Téléphone</th>
            <th className="text-left px-4 py-3">Groupe</th>
            <th className="text-left px-4 py-3">Paiement</th>
            <th className="text-left px-4 py-3">Statut</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data?.data.map(student => (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-gray-400">{student.studentCode}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onSelect?.(student)}
                  className="font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                >
                  {student.fullName}
                </button>
              </td>
              <td className="px-4 py-3 text-gray-500">{student.phone}</td>
              <td className="px-4 py-3 text-gray-500">
                {student.activeGroups?.[0]?.course?.title ?? '—'}
              </td>
              <td className="px-4 py-3">
                {student.paymentStatus ? <PaymentBadge status={student.paymentStatus} /> : '—'}
              </td>
              <td className="px-4 py-3">
                <StudentStatusBadge status={student.status} />
              </td>
              <td className="px-4 py-3 text-right">
                {student.status === 'active' && (
                  <button
                    onClick={() => archiveMutation.mutate(student.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Archiver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {/* Pagination */}
      {data && data.meta.lastPage > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>{data.meta.total} étudiants</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40">Préc.</button>
            <span className="px-3 py-1">{page} / {data.meta.lastPage}</span>
            <button onClick={() => setPage(p => Math.min(data.meta.lastPage, p + 1))} disabled={page === data.meta.lastPage}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40">Suiv.</button>
          </div>
        </div>
      )}
    </div>
  )
}
 
function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  )
}