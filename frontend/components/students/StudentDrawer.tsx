// components/students/StudentDrawer.tsx
// ============================================================
'use client'
import { useStudent } from '@/hooks/useStudents'
import { PaymentBadge, StudentStatusBadge, RiskBadge } from '@/components/ui/StatusBadge'
import type { Student } from '@/types'
 
interface Props {
  student: Student
  onClose: () => void
}
 
export function StudentDrawer({ student: preview, onClose }: Props) {
  const { data } = useStudent(preview.id)
  const student  = data?.data ?? preview
 
  const downloadReport = () => {
    window.open(`/api/v1/reports/student/${student.id}`, '_blank')
  }
 
  return (
    <div className="fixed inset-0 bg-black/20 z-40 flex justify-end" onClick={onClose}>
      <aside
        className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-gray-900">{student.fullName}</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{student.studentCode}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadReport}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              ↓ PDF
            </button>
            <button onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
        </div>
 
        <div className="flex-1 p-6 space-y-5">
          {/* Info */}
          <section>
            <p className="text-xs text-indigo-500 uppercase tracking-wide mb-3">Informations</p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-400">Téléphone</dt><dd>{student.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-400">Email</dt><dd>{student.email ?? '—'}</dd></div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Statut</dt>
                <dd><StudentStatusBadge status={student.status} /></dd>
              </div>
              <div className="flex justify-between"><dt className="text-gray-400">Inscription</dt><dd>{student.registrationDate}</dd></div>
            </dl>
          </section>
 
          {/* Groups */}
          {student.activeGroups?.length ? (
            <section>
              <p className="text-xs text-indigo-500 uppercase tracking-wide mb-3">Groupes actifs</p>
              <div className="space-y-2">
                {student.activeGroups.map(group => (
                  <div key={group.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-800">{group.course?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{group.name} · {group.startTime}–{group.endTime}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${group.progressPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{group.progressPercent}% complété</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
 
          {/* Risk */}
          {student.riskAnalysis && (
            <section>
              <p className="text-xs text-indigo-500 uppercase tracking-wide mb-3">Analyse IA</p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Score de risque</span>
                  <RiskBadge level={student.riskAnalysis.riskLevel} />
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Absences', value: student.riskAnalysis.absenceScore },
                    { label: 'Paiements', value: student.riskAnalysis.paymentScore },
                    { label: 'Progression', value: student.riskAnalysis.progressionScore },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-gray-500">{item.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${item.value}%`,
                            background: item.value >= 70 ? '#EF4444' : item.value >= 40 ? '#F59E0B' : '#10B981'
                          }} />
                      </div>
                      <span className="w-8 text-right text-gray-600">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-red-600 mt-3">{student.riskAnalysis.recommendation}</p>
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}