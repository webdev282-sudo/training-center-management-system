'use client'

import { useStudent } from '@/hooks/useStudents'
import { StudentStatusBadge, RiskBadge } from '@/components/ui/StatusBadge'
import type { Student } from '@/types'

interface Props {
  student: Student
  onClose: () => void
}

export function StudentDrawer({ student: preview, onClose }: Props) {
  const { data } = useStudent(preview.id)
  const student = data?.data ?? preview

  const printReport = () => {
    window.open(`/api/v1/reports/student/${student.id}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-slate-950/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/70 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200/70 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">
                {student.fullName}
              </p>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-400">
                {student.studentCode}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={printReport}
                type="button"
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_14px_30px_rgba(99,91,255,0.25)] transition hover:-translate-y-0.5"
              >
                Imprimer / PDF
              </button>

              <button
                onClick={onClose}
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-5">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-500">
              Informations
            </p>

            <dl className="space-y-3 text-sm">
              <InfoRow label="Téléphone" value={student.phone ?? '—'} />
              <InfoRow label="Email" value={student.email ?? '—'} />
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-400">Statut</dt>
                <dd>
                  <StudentStatusBadge status={student.status} />
                </dd>
              </div>
              <InfoRow label="Inscription" value={student.registrationDate ?? '—'} />
            </dl>
          </section>

          {student.activeGroups?.length ? (
            <section>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-500">
                Groupes actifs
              </p>

              <div className="space-y-3">
                {student.activeGroups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-[22px] border border-slate-200/70 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {group.course?.title ?? '—'}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {group.name} · {group.startTime}–{group.endTime}
                        </p>
                      </div>

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600">
                        {group.progressPercent ?? 0}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all"
                        style={{ width: `${group.progressPercent ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {student.riskAnalysis && (
            <section>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-500">
                Analyse IA
              </p>

              <div className="rounded-[24px] border border-red-100 bg-red-50/80 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">
                    Score de risque
                  </span>
                  <RiskBadge level={student.riskAnalysis.riskLevel} />
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Absences', value: student.riskAnalysis.absenceScore },
                    { label: 'Paiements', value: student.riskAnalysis.paymentScore },
                    { label: 'Progression', value: student.riskAnalysis.progressionScore },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-xs">
                      <span className="w-20 font-semibold text-slate-500">{item.label}</span>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.value ?? 0}%`,
                            background:
                              item.value >= 70
                                ? '#ef4444'
                                : item.value >= 40
                                  ? '#f59e0b'
                                  : '#10b981',
                          }}
                        />
                      </div>

                      <span className="w-8 text-right font-bold text-slate-600">
                        {item.value ?? 0}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs font-semibold leading-5 text-red-600">
                  {student.riskAnalysis.recommendation}
                </p>
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-semibold text-slate-800">{value}</dd>
    </div>
  )
}