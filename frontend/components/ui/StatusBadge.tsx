
import type { PaymentStatus } from '@/types'
 
const paymentConfig: Record<PaymentStatus, { label: string; className: string }> = {
  paid:    { label: 'Payé',       className: 'bg-green-50 text-green-700 border-green-200' },
  partial: { label: 'Partiel',    className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  pending: { label: 'En attente', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  overdue: { label: 'En retard',  className: 'bg-red-50 text-red-700 border-red-200' },
}
 
const studentStatusConfig = {
  active:    { label: 'Actif',    className: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Terminé',  className: 'bg-blue-50 text-blue-700 border-blue-200' },
  archived:  { label: 'Archivé',  className: 'bg-gray-100 text-gray-500 border-gray-200' },
}
 
const riskConfig = {
  low:    { label: 'Faible', className: 'bg-green-50 text-green-700 border-green-200' },
  medium: { label: 'Moyen',  className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  high:   { label: 'Élevé',  className: 'bg-red-50 text-red-700 border-red-200' },
}
 
export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = paymentConfig[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.className}`}>{cfg.label}</span>
}
 
export function StudentStatusBadge({ status }: { status: keyof typeof studentStatusConfig }) {
  const cfg = studentStatusConfig[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.className}`}>{cfg.label}</span>
}
 
export function RiskBadge({ level }: { level: keyof typeof riskConfig }) {
  const cfg = riskConfig[level]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.className}`}>● {cfg.label}</span>
}
 
