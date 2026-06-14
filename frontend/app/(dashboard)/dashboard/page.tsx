
'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  KpiCard,
  Card,
  CardHeader,
  Table,
  Th,
  Td,
  Tr,
  PaymentBadge,
  Avatar,
  ProgressBar,
  Empty,
  Skeleton,
} from '@/components/ui'

export default function DashboardPage() {
  const { data: kpis, isLoading: kLoad } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => api.get('/dashboard/kpis').then(r => r.data.data),
    refetchInterval: 60_000,
  })

  const { data: overdue } = useQuery({
    queryKey: ['dashboard-overdue'],
    queryFn: () => api.get('/dashboard/overdue-payments').then(r => r.data.data),
  })

  const { data: groups } = useQuery({
    queryKey: ['groups-active'],
    queryFn: () => api.get('/groups?status=active').then(r => r.data.data),
  })

  const overdueList = Array.isArray(overdue) ? overdue : []
  const groupsList = Array.isArray(groups) ? groups : []

  const IconStudent = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
  const IconCourse  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  const IconGroup   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  const IconAlert   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>

  return (
    <div className="page-container fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">Vue générale de votre centre</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18 }}>
        {kLoad ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={120} />)
        ) : (
          <>
            <div className="fade-up-1"><KpiCard label="Étudiants Actifs" value={kpis?.activeStudents ?? 0} delta="ce mois" deltaUp colorIndex={0} icon={<IconStudent />} /></div>
            <div className="fade-up-2"><KpiCard label="Formations" value={kpis?.activeCourses ?? 0} colorIndex={1} icon={<IconCourse />} /></div>
            <div className="fade-up-3"><KpiCard label="Groupes Actifs" value={kpis?.activeGroups ?? 0} colorIndex={2} icon={<IconGroup />} /></div>
            <div className="fade-up-4"><KpiCard label="Paiements en Retard" value={kpis?.overduePayments ?? 0} deltaUp={false} colorIndex={3} icon={<IconAlert />} /></div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <Card className="fade-up">
          <CardHeader action={<a href="/payments?status=overdue" className="link">Voir tout →</a>}>
            Paiements à Suivre
          </CardHeader>

          <div style={{ padding: '0 16px 12px' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Étudiant</Th>
                  <Th>Cours</Th>
                  <Th right>Montant</Th>
                  <Th>Échéance</Th>
                  <Th>Statut</Th>
                </tr>
              </thead>

              <tbody>
                {overdueList.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <Empty message="Aucun paiement en retard" />
                    </td>
                  </tr>
                )}

                {overdueList.slice(0, 6).map((p: any) => (
                  <Tr key={p.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={p.student?.fullName ?? 'U'} size={32} />
                        <span style={{ fontWeight: 600 }}>{p.student?.fullName ?? '—'}</span>
                      </div>
                    </Td>

                    <Td>
                      <span className="text-muted">
                        {p.enrollment?.group?.course?.title ?? '—'}
                      </span>
                    </Td>

                    <Td right>
                      <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                        {Number(p.remainingAmount ?? 0).toLocaleString('fr-DZ')} DA
                      </span>
                    </Td>

                    <Td>
                      <span className="text-muted">{p.dueDate ?? '—'}</span>
                    </Td>

                    <Td>
                      <PaymentBadge status={p.paymentStatus ?? 'pending'} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card className="fade-up">
            <CardHeader action={<a href="/groups" className="link">Voir tout →</a>}>
              Groupes Actifs
            </CardHeader>

            <div style={{ padding: 16 }}>
              {groupsList.slice(0, 5).map((g: any) => (
                <div key={g.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{g.name ?? '—'}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {g.course?.title ?? '—'}
                      </div>
                    </div>

                    <span className="mono">
                      {g.enrolledCount ?? 0}/{g.capacity ?? 0}
                    </span>
                  </div>

                  <ProgressBar
                    value={Number(g.enrolledCount ?? 0)}
                    max={Number(g.capacity ?? 100)}
                    colorFrom={(g.enrolledCount ?? 0) >= (g.capacity ?? 0) ? '#ef4444' : 'var(--accent)'}
                    colorTo={(g.enrolledCount ?? 0) >= (g.capacity ?? 0) ? '#f97316' : 'var(--accent-2)'}
                  />
                </div>
              ))}

              {!groupsList.length && <Empty message="Aucun groupe actif" />}
            </div>
          </Card>

          <Card className="fade-up" style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>
              ⚡ Alertes IA
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>🔴 {kpis?.atRiskStudents ?? 0} étudiants à risque</div>
              <div>🟡 {kpis?.overduePayments ?? 0} paiements en retard</div>
              <div>🟢 Présence : {kpis?.avgAttendanceRate ?? 0}%</div>
            </div>

            <a href="/ai" className="link" style={{ marginTop: 10, display: 'inline-block' }}>
              Voir l'analyse →
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}