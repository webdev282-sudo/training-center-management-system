'use client'

import { useQuery } from '@tanstack/react-query'
import api, { downloadPdf } from '@/lib/api'
import { PageHeader, Card, Button } from '@/components/ui'

export default function SchedulePage() {
  const { data: groups = [] } = useQuery({
    queryKey: ['groups-schedule'],
    queryFn: () =>
      api.get('/groups?status=active').then((r) => r.data?.data ?? []),
  })

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const dayKeys = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

  
  const slots = Array.from<string>(
  new Set<string>(
    groups
      .map((g: any) => g.startTime?.slice(0, 5))
      .filter((time: any): time is string => typeof time === 'string')
  )
).sort()

  const colors = [
    'var(--accent)',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#3b82f6',
    '#ec4899',
  ]

  const schedule: Record<string, Record<string, any[]>> = {}

  groups.forEach((g: any, i: number) => {
    g.days?.forEach((day: string) => {
      if (!schedule[day]) schedule[day] = {}

      const slot = g.startTime?.slice(0, 5) ?? '08:00'

      if (!schedule[day][slot]) schedule[day][slot] = []

      schedule[day][slot].push({
        ...g,
        color: colors[i % colors.length],
      })
    })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PageHeader
  title="Planning Hebdomadaire"
  subtitle="Vue d'ensemble des groupes actifs"
/>
      

      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  }}
>
  <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
    {groups.length} groupe(s) actif(s) · {slots.length} horaire(s)
  </div>

  <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
    Planning organisé par jour et horaire
  </div>
</div>





      <Card>
  <div
    style={{
      overflowX: 'auto',
      borderRadius: 18,
      border: '1px solid var(--border)',
      background:
        'linear-gradient(180deg, var(--card), color-mix(in srgb, var(--muted) 35%, transparent))',
    }}
  >
    <table
      style={{
        width: '100%',
        minWidth: 980,
        borderCollapse: 'separate',
        borderSpacing: 0,
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              position: 'sticky',
              left: 0,
              top: 0,
              zIndex: 4,
              padding: '18px 16px',
              width: 115,
              textAlign: 'left',
              fontSize: 12,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
              background: 'var(--card)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            Horaire
          </th>

          {days.map((d) => (
            <th
              key={d}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 3,
                padding: '18px 16px',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 800,
                color: 'var(--foreground)',
                background:
                  'linear-gradient(180deg, var(--card), var(--muted))',
                borderBottom: '1px solid var(--border)',
                borderLeft: '1px solid var(--border)',
              }}
            >
              {d}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {slots.length === 0 && (
          <tr>
            <td
              colSpan={7}
              style={{
                padding: 60,
                textAlign: 'center',
                color: 'var(--muted-foreground)',
              }}
            >
              Aucun groupe actif à afficher
            </td>
          </tr>
        )}

        {slots.map((slot: string) => (
          <tr key={slot}>
            <td
              style={{
                position: 'sticky',
                left: 0,
                zIndex: 2,
                padding: '16px',
                fontWeight: 800,
                fontSize: 13,
                whiteSpace: 'nowrap',
                color: 'var(--foreground)',
                background: 'var(--card)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 10px',
                  borderRadius: 999,
                  background: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                🕒 {slot}
              </div>
            </td>

            {dayKeys.map((day) => {
              const cell = schedule[day]?.[slot] ?? []

              return (
                <td
                  key={day}
                  style={{
                    padding: 12,
                    minWidth: 165,
                    height: 112,
                    verticalAlign: 'top',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                    background: cell.length
                      ? 'transparent'
                      : 'repeating-linear-gradient(45deg, transparent, transparent 8px, color-mix(in srgb, var(--muted) 45%, transparent) 8px, color-mix(in srgb, var(--muted) 45%, transparent) 16px)',
                  }}
                >
                  {cell.length === 0 && (
                    <div
                      style={{
                        height: '100%',
                        minHeight: 72,
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: 'var(--muted-foreground)',
                        opacity: 0.55,
                      }}
                    >
                      Libre
                    </div>
                  )}

                  {cell.map((g: any) => (
                    <div
                      key={g.id}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${g.color}22, ${g.color}08)`,
                        border: `1px solid ${g.color}40`,
                        borderLeft: `5px solid ${g.color}`,
                        borderRadius: 16,
                        padding: '12px 13px',
                        marginBottom: 10,
                        boxShadow:
                          '0 8px 20px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.18)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          right: -18,
                          top: -18,
                          width: 58,
                          height: 58,
                          borderRadius: '50%',
                          background: `${g.color}22`,
                        }}
                      />

                      <div
                        style={{
                          position: 'relative',
                          fontWeight: 800,
                          fontSize: 13,
                          marginBottom: 8,
                          color: 'var(--foreground)',
                          lineHeight: 1.3,
                        }}
                      >
                        {g.course?.title ?? 'Sans cours'}
                      </div>

                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          fontSize: 11,
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        <span>👥 {g.name}</span>
                        <span>👨‍🏫 {g.teacher?.fullName ?? 'Enseignant N/A'}</span>

                        <div
                          style={{
                            display: 'flex',
                            gap: 6,
                            flexWrap: 'wrap',
                            marginTop: 4,
                          }}
                        >
                          <span
                            style={{
                              borderRadius: 999,
                              padding: '4px 8px',
                              fontWeight: 700,
                              background: `${g.color}22`,
                              color: g.color,
                            }}
                          >
                            {g.startTime?.slice(0, 5)} – {g.endTime?.slice(0, 5)}
                          </span>

                          <span
                            style={{
                              borderRadius: 999,
                              padding: '4px 8px',
                              fontWeight: 700,
                              background: 'var(--muted)',
                              color: 'var(--foreground)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            📍 {g.room ?? 'Salle N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Card>

    </div>
  )
}