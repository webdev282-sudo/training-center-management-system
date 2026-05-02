'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

import {
  PageHeader,
  Card,
  Table,
  Th,
  Tr,
  Td,
  Avatar,
  Empty,
  StatusBadge,
} from '@/components/ui'

export default function ArchivePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['archived-students'],
    queryFn: () =>
      api
        .get('/students', { params: { status: 'archived' } })
        .then((r) => r.data),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Archive"
        subtitle={'${data?.meta?.total ?? 0} étudiant(s) archivé(s)'}
      />

      <Card>
        {isLoading ? (
          <div style={{ padding: 24, color: 'var(--text-muted)' }}>
            Chargement...
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Étudiant</Th>
                <Th>Téléphone</Th>
                <Th>Email</Th>
                <Th>Formations étudiées</Th>
                <Th>Statut</Th>
              </tr>
            </thead>

            <tbody>
              {data?.data?.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <Empty message="Aucun étudiant archivé" />
                  </td>
                </tr>
              )}

              {data?.data?.map((s: any) => (
                <Tr key={s.id}>
                  <Td mono>{s.studentCode}</Td>

                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.fullName} size={30} />
                      <span style={{ fontWeight: 500 }}>{s.fullName}</span>
                    </div>
                  </Td>

                  <Td>{s.phone}</Td>

                  <Td>{s.email ?? '—'}</Td>

                  <Td>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {s.formations?.length
                        ? s.formations
                            .map((f: any) => f.title + '(' + f.group +')')
                            .join(', ')
                        : '—'}
                    </span>
                  </Td>

                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}