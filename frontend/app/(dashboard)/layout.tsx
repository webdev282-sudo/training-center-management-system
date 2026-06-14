
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: <IconGrid /> },
  { href: '/students', label: 'Étudiants', icon: <IconUsers /> },
  { href: '/teachers', label: 'Enseignants', icon: <IconTeacher /> },
  { href: '/courses', label: 'Formations', icon: <IconBook /> },
  { href: '/groups', label: 'Groupes', icon: <IconGroup /> },
  { href: '/schedule', label: 'Planning', icon: <IconCalendar /> },
  { href: '/attendance', label: 'Présences', icon: <IconCheck /> },
  { href: '/payments', label: 'Paiements', icon: <IconPayment /> },
  { href: '/ai', label: 'IA Insights', icon: <IconAI /> },
  { href: '/archive', label: 'Archive', icon: <IconArchive /> },
  
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [adminName, setAdminName] = useState('Admin')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('adminName')

    if (!token) router.push('/login')
    if (name) setAdminName(name)
  }, [router])

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>I</div>
          <div>
            <div style={styles.logoTitle}>ILIMA</div>
            <div style={styles.logoSub}>Formation & Consulting</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.navIcon,
                    opacity: active ? 1 : 0.65,
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div style={styles.adminCard}>
          <div style={styles.avatar}>{adminName[0]?.toUpperCase()}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.adminName}>{adminName}</div>
            <div style={styles.adminRole}>Administrateur</div>
          </div>

          <button onClick={logout} title="Déconnexion" style={styles.logoutBtn}>
            <IconLogout />
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.searchBox}>
            <IconSearch />
            <input
              placeholder="Rechercher étudiants, cours, groupes..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.topRight}>
            <div style={styles.dateText}>
              {new Date().toLocaleDateString('fr-DZ', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </div>

            <div style={styles.topAvatar}>{adminName[0]?.toUpperCase()}</div>
          </div>
        </header>

        <div style={styles.content}>{children}</div>
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background:
      'radial-gradient(circle at top left, rgba(99,91,255,.13), transparent 32%), radial-gradient(circle at top right, rgba(6,182,212,.10), transparent 28%), var(--bg)',
  },

  sidebar: {
    width: 250,
    flexShrink: 0,
    background: 'rgba(255,255,255,.72)',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    overflowY: 'auto',
    boxShadow: '8px 0 30px rgba(15,23,42,.04)',
  },

  logoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 8px 22px',
    marginBottom: 8,
  },

  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 800,
    color: '#fff',
    boxShadow: '0 16px 32px rgba(99,91,255,.28)',
  },

  logoTitle: {
    fontWeight: 800,
    fontSize: 18,
    color: 'var(--text)',
    letterSpacing: '-.03em',
  },

  logoSub: {
    fontSize: 11,
    color: 'var(--text-3)',
    marginTop: 1,
  },

  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    padding: '11px 13px',
    borderRadius: 14,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-2)',
    transition: 'all .18s ease',
  },

  navItemActive: {
    color: '#fff',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    boxShadow: '0 16px 32px rgba(99,91,255,.26)',
  },

  navIcon: {
    width: 19,
    height: 19,
    display: 'flex',
    flexShrink: 0,
  },

  adminCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 18,
    background: 'rgba(255,255,255,.82)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
  },

  adminName: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  adminRole: {
    fontSize: 11,
    color: 'var(--text-3)',
  },

  logoutBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-3)',
    padding: 5,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
  },

  main: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  topbar: {
    height: 72,
    flexShrink: 0,
    background: 'rgba(255,255,255,.62)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    background: 'rgba(255,255,255,.86)',
    borderRadius: 16,
    padding: '11px 15px',
    border: '1px solid var(--border)',
    flex: 1,
    maxWidth: 430,
    boxShadow: 'var(--shadow-xs)',
    color: 'var(--text-3)',
  },

  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontSize: 13,
    fontFamily: 'var(--font)',
    flex: 1,
  },

  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  dateText: {
    fontSize: 12,
    color: 'var(--text-2)',
    fontWeight: 600,
    textTransform: 'capitalize',
  },

  topAvatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 800,
    color: '#fff',
    boxShadow: '0 12px 28px rgba(99,91,255,.24)',
  },

  content: {
    flex: 1,
    overflow: 'auto',
    padding: 28,
  },
}

function IconLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconGrid() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
}
function IconUsers() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function IconTeacher() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
}
function IconBook() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
}
function IconGroup() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function IconCalendar() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
}
function IconCheck() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
}
function IconPayment() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
}
function IconAI() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
}
function IconArchive() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
}
