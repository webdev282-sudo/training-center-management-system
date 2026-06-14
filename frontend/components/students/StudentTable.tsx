
'use client'

import { useState } from 'react'
import { useStudents, useArchiveStudent } from '@/hooks/useStudents'
import { PaymentBadge, StudentStatusBadge } from '@/components/ui/StatusBadge'
import type { Student } from '@/types'

interface Props {
  onSelect?: (student: Student) => void
}

export function StudentTable({ onSelect }: Props) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useStudents({ search, status, page })
  const archiveMutation = useArchiveStudent()

  const printStudents = () => {
    window.open('/api/v1/reports/students', '_blank')
  }

  if (isLoading) return <TableSkeleton />

  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 bg-slate-50/50 p-5 md:flex-row md:items-center">
        <input
          type="search"
          placeholder="Rechercher un étudiant..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="min-w-[260px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="completed">Terminés</option>
          <option value="archived">Archivés</option>
        </select>

        <button
          onClick={printStudents}
          type="button"
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(99,91,255,0.24)] transition hover:-translate-y-0.5"
        >
          Imprimer la liste
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-xs uppercase tracking-[0.08em] text-slate-400">
              <th className="px-5 py-4 text-left font-extrabold">Code</th>
              <th className="px-5 py-4 text-left font-extrabold">Nom</th>
              <th className="px-5 py-4 text-left font-extrabold">Téléphone</th>
              <th className="px-5 py-4 text-left font-extrabold">Groupe</th>
              <th className="px-5 py-4 text-left font-extrabold">Paiement</th>
              <th className="px-5 py-4 text-left font-extrabold">Statut</th>
              <th className="px-5 py-4 text-right font-extrabold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((student) => (
              <tr key={student.id} className="transition hover:bg-indigo-50/35">
                <td className="border-b border-slate-100 px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-500">
                    {student.studentCode}
                  </span>
                </td>

                <td className="border-b border-slate-100 px-5 py-4">
                  <button
                    onClick={() => onSelect?.(student)}
                    className="text-left font-extrabold text-slate-900 transition hover:text-indigo-600"
                    type="button"
                  >
                    {student.fullName}
                  </button>
                </td>

                <td className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-500">
                  {student.phone ?? '—'}
                </td>

                <td className="border-b border-slate-100 px-5 py-4">
                  <span className="font-semibold text-slate-600">
                    {student.activeGroups?.[0]?.course?.title ?? '—'}
                  </span>
                </td>

                <td className="border-b border-slate-100 px-5 py-4">
                  {student.paymentStatus ? (
                    <PaymentBadge status={student.paymentStatus} />
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                <td className="border-b border-slate-100 px-5 py-4">
                  <StudentStatusBadge status={student.status} />
                </td>

                <td className="border-b border-slate-100 px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {student.status === 'active' && (
                      <button
                        onClick={() => archiveMutation.mutate(student.id)}
                        type="button"
                        className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-500 transition hover:bg-red-100"
                      >
                        Archiver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!data?.data?.length && (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-sm font-semibold text-slate-400">
                  Aucun étudiant trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.meta.lastPage > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/70 px-5 py-4 text-xs font-semibold text-slate-500">
          <span>{data.meta.total} étudiants</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold transition hover:bg-slate-50 disabled:opacity-40"
              type="button"
            >
              Préc.
            </button>

            <span className="rounded-xl bg-slate-100 px-3 py-2 font-bold text-slate-600">
              {page} / {data.meta.lastPage}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(data.meta.lastPage, p + 1))}
              disabled={page === data.meta.lastPage}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold transition hover:bg-slate-50 disabled:opacity-40"
              type="button"
            >
              Suiv.
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-[26px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}