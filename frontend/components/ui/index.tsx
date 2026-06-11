'use client'

import { ReactNode, CSSProperties, useState } from 'react'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'default'
type BtnVariant = 'primary' | 'ghost' | 'danger' | 'success'

export function Card({
  children,
  style,
  className,
  onClick,
}: {
  children: ReactNode
  style?: CSSProperties
  className?: string
  inset?: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,.86)',
        border: '1px solid rgba(15,23,42,.08)',
        borderRadius: 22,
        boxShadow: hovered ? '0 22px 50px rgba(15,23,42,.10)' : '0 10px 28px rgba(15,23,42,.06)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all .22s ease',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div
      style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(15,23,42,.06)',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{children}</span>
      {action}
    </div>
  )
}

const KPI_CONFIGS = [
  { from: '#635bff', to: '#8b5cf6', bg: 'rgba(99,91,255,.12)' },
  { from: '#0ea5e9', to: '#06b6d4', bg: 'rgba(14,165,233,.12)' },
  { from: '#10b981', to: '#22c55e', bg: 'rgba(16,185,129,.12)' },
  { from: '#ef4444', to: '#f97316', bg: 'rgba(239,68,68,.12)' },
]

export function KpiCard({
  label,
  value,
  delta,
  deltaUp,
  icon,
  colorIndex = 0,
}: {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  icon?: ReactNode
  colorIndex?: number
}) {
  const c = KPI_CONFIGS[colorIndex % KPI_CONFIGS.length]
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 142,
        padding: 22,
        borderRadius: 24,
        background: 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.75))',
        border: '1px solid rgba(15,23,42,.08)',
        boxShadow: hovered ? '0 24px 55px rgba(15,23,42,.12)' : '0 12px 30px rgba(15,23,42,.07)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all .22s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -35,
          top: -35,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
          opacity: 0.1,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 700, marginBottom: 12 }}>
            {label}
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: 850,
              letterSpacing: '-.05em',
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            {value}
          </div>

          {delta && (
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: 700,
                color: deltaUp ? '#10b981' : '#ef4444',
              }}
            >
              {deltaUp ? '↑' : '↓'} {delta}
            </div>
          )}
        </div>

        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            background: c.bg,
            color: c.from,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

const BADGE_MAP: Record<BadgeVariant, CSSProperties> = {
  success: { background: 'rgba(16,185,129,.12)', color: '#047857', borderColor: 'rgba(16,185,129,.20)' },
  danger: { background: 'rgba(239,68,68,.12)', color: '#dc2626', borderColor: 'rgba(239,68,68,.20)' },
  warning: { background: 'rgba(245,158,11,.14)', color: '#b45309', borderColor: 'rgba(245,158,11,.22)' },
  info: { background: 'rgba(59,130,246,.12)', color: '#2563eb', borderColor: 'rgba(59,130,246,.20)' },
  purple: { background: 'rgba(99,91,255,.12)', color: '#4f46e5', borderColor: 'rgba(99,91,255,.20)' },
  default: { background: 'rgba(100,116,139,.10)', color: '#64748b', borderColor: 'rgba(100,116,139,.16)' },
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: BadgeVariant }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        border: '1px solid',
        ...BADGE_MAP[variant],
      }}
    >
      {children}
    </span>
  )
}

export function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, [string, BadgeVariant]> = {
    paid: ['Soldé', 'success'],
    partial: ['Partiel', 'warning'],
    pending: ['En attente', 'info'],
    overdue: ['En retard', 'danger'],
  }

  const [label, variant] = map[status] ?? [status, 'default']
  return <Badge variant={variant}>{label}</Badge>
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, BadgeVariant]> = {
    active: ['Actif', 'success'],
    completed: ['Terminé', 'info'],
    archived: ['Archivé', 'default'],
  }

  const [label, variant] = map[status] ?? [status, 'default']
  return <Badge variant={variant}>{label}</Badge>
}

export function RiskBadge({ level }: { level: string }) {
  const map: Record<string, [string, BadgeVariant]> = {
    high: ['Élevé', 'danger'],
    medium: ['Moyen', 'warning'],
    low: ['Faible', 'success'],
  }

  const [label, variant] = map[level] ?? [level, 'default']
  return <Badge variant={variant}>{label}</Badge>
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  style?: CSSProperties
  type?: 'button' | 'submit'
}) {
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
      color: '#fff',
      border: 'none',
      boxShadow: '0 14px 32px rgba(99,91,255,.24)',
    },
    ghost: {
      background: 'rgba(255,255,255,.78)',
      color: 'var(--text)',
      border: '1px solid rgba(15,23,42,.08)',
    },
    danger: {
      background: 'rgba(239,68,68,.10)',
      color: '#dc2626',
      border: '1px solid rgba(239,68,68,.18)',
    },
    success: {
      background: 'rgba(16,185,129,.10)',
      color: '#059669',
      border: '1px solid rgba(16,185,129,.18)',
    },
  }

  const sizes: Record<string, CSSProperties> = {
    sm: { fontSize: 12, padding: '7px 12px' },
    md: { fontSize: 13, padding: '10px 16px' },
    lg: { fontSize: 14, padding: '13px 22px' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 13,
        fontFamily: 'var(--font)',
        fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.55 : 1,
        transition: 'all .18s ease',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  error,
}: {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  type?: string
  icon?: ReactNode
  error?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-3)',
            display: 'flex',
          }}
        >
          {icon}
        </span>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: '#fff',
          border: focused ? '1px solid rgba(99,91,255,.45)' : '1px solid rgba(15,23,42,.09)',
          borderRadius: 14,
          padding: icon ? '11px 14px 11px 40px' : '11px 14px',
          color: 'var(--text)',
          fontSize: 13,
          fontFamily: 'var(--font)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 4px rgba(99,91,255,.10)' : '0 4px 14px rgba(15,23,42,.04)',
        }}
      />

      {error && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 5 }}>{error}</p>}
    </div>
  )
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
        {children}
      </table>
    </div>
  )
}

export function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th
      style={{
        padding: '13px 16px',
        textAlign: right ? 'right' : 'left',
        fontSize: 11,
        fontWeight: 850,
        color: 'var(--text-3)',
        textTransform: 'uppercase',
        letterSpacing: '.06em',
        background: 'rgba(248,250,252,.88)',
        borderBottom: '1px solid rgba(15,23,42,.07)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  )
}

export function Td({ children, right, mono }: { children: ReactNode; right?: boolean; mono?: boolean }) {
  return (
    <td
      style={{
        padding: '14px 16px',
        textAlign: right ? 'right' : 'left',
        borderBottom: '1px solid rgba(15,23,42,.055)',
        color: 'var(--text)',
        fontFamily: mono ? 'var(--mono)' : 'inherit',
        fontSize: mono ? 12 : 13,
      }}
    >
      {children}
    </td>
  )
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: hovered ? 'rgba(99,91,255,.035)' : 'transparent',
        transition: 'background .15s ease',
      }}
    >
      {children}
    </tr>
  )
}

const AVA_GRADIENTS = [
  'linear-gradient(135deg,#635bff,#8b5cf6)',
  'linear-gradient(135deg,#0ea5e9,#06b6d4)',
  'linear-gradient(135deg,#10b981,#22c55e)',
  'linear-gradient(135deg,#ef4444,#f97316)',
  'linear-gradient(135deg,#f59e0b,#fbbf24)',
]

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const safeName = name || 'U'
  const idx = (safeName.charCodeAt(0) + (safeName.charCodeAt(1) || 0)) % AVA_GRADIENTS.length
  const initials = safeName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: AVA_GRADIENTS[idx],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.33,
        fontWeight: 850,
        color: '#fff',
        flexShrink: 0,
        boxShadow: '0 10px 22px rgba(15,23,42,.14)',
      }}
    >
      {initials}
    </div>
  )
}

export function ProgressBar({
  value,
  max = 100,
  colorFrom = 'var(--accent)',
  colorTo = 'var(--accent-2)',
}: {
  value: number
  max?: number
  colorFrom?: string
  colorTo?: string
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div
      style={{
        height: 8,
        borderRadius: 999,
        overflow: 'hidden',
        background: 'rgba(15,23,42,.07)',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
          borderRadius: 999,
          transition: 'width .5s ease',
        }}
      />
    </div>
  )
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,.34)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 30px 80px rgba(15,23,42,.22)',
          border: '1px solid rgba(255,255,255,.8)',
        }}
      >
        <CardHeader
          action={
            <button
              onClick={onClose}
              style={{
                background: 'rgba(15,23,42,.05)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-2)',
                fontSize: 20,
                width: 32,
                height: 32,
                borderRadius: 10,
              }}
            >
              ×
            </button>
          }
        >
          {title}
        </CardHeader>

        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  )
}

export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-2)' }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 850, letterSpacing: '-.05em', color: 'var(--text)' }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Skeleton({
  width = '100%',
  height = 14,
  style,
}: {
  width?: string | number
  height?: number
  style?: CSSProperties
}) {
  return <div className="skeleton" style={{ width, height, borderRadius: 18, ...style }} />
}

export function Empty({ message = 'Aucune donnée disponible' }: { message?: string }) {
  return (
    <div style={{ padding: '50px 24px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
      <div style={{ fontSize: 38, marginBottom: 12, opacity: 0.35 }}>◎</div>
      {message}
    </div>
  )
}

export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onChange(!value)}>
      <div
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          background: value ? 'linear-gradient(135deg,var(--accent),var(--accent-2))' : 'rgba(15,23,42,.10)',
          position: 'relative',
          transition: 'all .2s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 5px 12px rgba(15,23,42,.18)',
            transition: 'all .2s ease',
          }}
        />
      </div>

      {label && <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{label}</span>}
    </div>
  )
}