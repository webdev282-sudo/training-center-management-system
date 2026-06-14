
interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
}
 
export function KpiCard({ label, value, delta, deltaType = 'neutral' }: KpiCardProps) {
  const deltaColor = { up: 'text-green-600', down: 'text-red-600', neutral: 'text-gray-400' }[deltaType]
 
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      {delta && <p className={`text-xs mt-1 ${deltaColor}`}>{delta}</p>}
    </div>
  )
}