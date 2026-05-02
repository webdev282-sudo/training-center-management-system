// ============================================================
// components/ui/index.tsx  —  ILIMA Shared UI Components
// ============================================================
'use client'
import { ReactNode, CSSProperties } from 'react'

// ── IlimaCard ────────────────────────────────────────────────
export function Card({
  children, style, className,
  glow = false,
}: { children: ReactNode; style?: CSSProperties; className?: string; glow?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-card)',
      ...style,
    }} className={className}>
      {children}
    </div>
  )
}

export function CardHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{children}</span>
      {action}
    </div>
  )
}

// ── KpiCard ──────────────────────────────────────────────────
const KPI_COLORS = [
  { bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', glow: 'rgba(245,158,11,.3)' },
  { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,.3)' },
  { bg: 'linear-gradient(135deg,#10b981,#3b82f6)', glow: 'rgba(16,185,129,.3)' },
  { bg: 'linear-gradient(135deg,#ef4444,#ec4899)', glow: 'rgba(239,68,68,.3)'  },
]

export function KpiCard({
  label, value, delta, deltaUp, icon, colorIndex = 0,
}: {
  label: string; value: string | number; delta?: string;
  deltaUp?: boolean; icon?: ReactNode; colorIndex?: number;
}) {
  const c = KPI_COLORS[colorIndex % KPI_COLORS.length]
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '20px',
      display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: `var(--shadow-card), 0 0 30px ${c.glow}`,
      position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `var(--shadow-card), 0 0 40px ${c.glow}`
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `var(--shadow-card), 0 0 30px ${c.glow}`
    }}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: c.bg, opacity: 0.15, filter: 'blur(20px)',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 6 }}>
            {label}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, background: c.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {value}
          </div>
        </div>
        {icon && (
          <div style={{
            width: 42, height: 42, borderRadius: 'var(--r-sm)',
            background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', flexShrink: 0, opacity: 0.9,
          }}>{icon}</div>
        )}
      </div>

      {delta && (
        <div style={{ fontSize: 12, color: deltaUp ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{deltaUp ? '↑' : '↓'}</span>
          <span>{delta}</span>
        </div>
      )}
    </div>
  )
}

// ── Badge ────────────────────────────────────────────────────
type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'default'

const BADGE_STYLES: Record<BadgeVariant, CSSProperties> = {
  success: { background: 'rgba(16,185,129,.15)',  color: '#34d399', border: '1px solid rgba(16,185,129,.3)' },
  danger:  { background: 'rgba(239,68,68,.15)',   color: '#f87171', border: '1px solid rgba(239,68,68,.3)' },
  warning: { background: 'rgba(245,158,11,.15)',  color: '#fbbf24', border: '1px solid rgba(245,158,11,.3)' },
  info:    { background: 'rgba(59,130,246,.15)',  color: '#60a5fa', border: '1px solid rgba(59,130,246,.3)' },
  purple:  { background: 'rgba(99,102,241,.15)',  color: '#a5b4fc', border: '1px solid rgba(99,102,241,.3)' },
  default: { background: 'rgba(75,85,105,.3)',    color: 'var(--text-secondary)', border: '1px solid var(--border)' },
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: BadgeVariant }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 99,
      fontSize: 11, fontWeight: 600,
      ...BADGE_STYLES[variant],
    }}>
      {children}
    </span>
  )
}

export function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    paid:    { label: 'Soldé',      variant: 'success' },
    partial: { label: 'Partiel',   variant: 'warning' },
    pending: { label: 'En attente',variant: 'info'    },
    overdue: { label: 'En retard', variant: 'danger'  },
  }
  const cfg = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    active:    { label: 'Actif',    variant: 'success' },
    completed: { label: 'Terminé', variant: 'info'    },
    archived:  { label: 'Archivé', variant: 'default' },
  }
  const cfg = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

export function RiskBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    high:   { label: '● Élevé',  variant: 'danger'  },
    medium: { label: '● Moyen',  variant: 'warning' },
    low:    { label: '● Faible', variant: 'success' },
  }
  const cfg = map[level] ?? { label: level, variant: 'default' as BadgeVariant }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

// ── IlimaTable ───────────────────────────────────────────────
export function Table({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {children}
      </table>
    </div>
  )
}

export function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th style={{
      padding: '11px 16px',
      textAlign: right ? 'right' : 'left',
      fontSize: 11, fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '.5px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
      whiteSpace: 'nowrap',
    }}>{children}</th>
  )
}

export function Td({ children, right, mono }: { children: ReactNode; right?: boolean; mono?: boolean }) {
  return (
    <td style={{
      padding: '12px 16px',
      textAlign: right ? 'right' : 'left',
      borderBottom: '1px solid var(--border)',
      color: 'var(--text-primary)',
      fontFamily: mono ? 'var(--mono)' : 'inherit',
      fontSize: mono ? 12 : 13,
    }}>{children}</td>
  )
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-card-hover)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
    >{children}</tr>
  )
}

// ── Avatar ───────────────────────────────────────────────────
const AVA_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899','#8b5cf6']

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const idx = name.charCodeAt(0) % AVA_COLORS.length
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${AVA_COLORS[idx]}, ${AVA_COLORS[(idx+2)%AVA_COLORS.length]})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>{initials}</div>
  )
}

// ── Button ───────────────────────────────────────────────────
export function Button({
  children, onClick, variant = 'primary', size = 'md', disabled, style,
}: {
  children: ReactNode; onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md'; disabled?: boolean; style?: CSSProperties;
}) {
  const variants: Record<string, CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, var(--accent), #4f46e5)', color: '#fff', border: 'none', boxShadow: '0 0 16px var(--accent-glow)' },
    ghost:   { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    outline: { background: 'transparent', color: 'var(--accent-light)', border: '1px solid var(--accent)' },
    danger:  { background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.3)' },
  }
  const sizes: Record<string, CSSProperties> = {
    sm: { fontSize: 12, padding: '6px 12px', borderRadius: 'var(--r-sm)' },
    md: { fontSize: 13, padding: '9px 18px', borderRadius: 'var(--r-sm)' },
  }
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        fontFamily: 'var(--font)', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        opacity: disabled ? 0.5 : 1, transition: 'all 0.2s',
        ...variants[variant], ...sizes[size], ...style,
      }}
    >{children}</button>
  )
}

// ── Input ────────────────────────────────────────────────────
export function Input({ placeholder, value, onChange, type = 'text', icon }: {
  placeholder?: string; value?: string; onChange?: (v: string) => void;
  type?: string; icon?: ReactNode;
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && <span style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>}
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange?.(e.target.value)}
        style={{
          width: '100%', background: 'var(--bg-elevated)',
          border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
          padding: icon ? '9px 14px 9px 36px' : '9px 14px',
          color: 'var(--text-primary)', fontSize: 13,
          fontFamily: 'var(--font)', outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}

// ── ProgressBar ──────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'var(--accent)' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ width = '100%', height = 16, style }: { width?: string | number; height?: number; style?: CSSProperties }) {
  return <div className="skeleton" style={{ width, height, ...style }} />
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)', width: '100%', maxWidth: 480,
          boxShadow: '0 24px 64px rgba(0,0,0,.5)',
          animation: 'fadeUp 0.25s ease',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 20, lineHeight: 1,
            display: 'flex', alignItems: 'center',
          }}>×</button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── FormField ────────────────────────────────────────────────
export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: '#f87171' }}>{error}</span>}
    </div>
  )
}

// ── PageHeader ───────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.3px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────
export function Empty({ message = 'Aucune donnée disponible' }: { message?: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: .5 }}>◎</div>
      {message}
    </div>
  )
}