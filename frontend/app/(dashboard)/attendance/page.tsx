'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/lib/api'

import {
  PageHeader,
  Card,
  CardHeader,
  Input,
  Button,
  Empty,
  Table,
  Th,
  Tr,
  Td,
  Avatar,
} from '@/components/ui'

export default function AttendancePage() {
  const qc = useQueryClient()

  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const [records, setRecords] = useState<Record<number, string>>({})
  const [notes, setNotes] = useState<Record<number, string>>({})

  const { data: groups = [] } = useQuery({
    queryKey: ['groups-list'],
    queryFn: () =>
      api.get('/groups?status=active').then((r) => r.data?.data ?? []),
  })

  const selectedGroup = groups.find(
    (g: any) => String(g.id) === String(selectedGroupId)
  )

  const { data: sessions = [] } = useQuery({
    queryKey: ['group-sessions', selectedGroupId],
    queryFn: () =>
      selectedGroupId
        ? api
            .get('/sessions', { params: { group_id: selectedGroupId } })
            .then((r) => r.data?.data ?? [])
        : Promise.resolve([]),
    enabled: !!selectedGroupId,
  })

  const selectedSession = sessions.find(
    (s: any) => Number(s.id) === Number(selectedSessionId)
  )

  const { data: students = [] } = useQuery({
    queryKey: ['group-students', selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) return []
      const res = await api.get(`/groups/${selectedGroupId}`)
      return res.data?.data?.enrollments?.map((e: any) => e.student) ?? []
    },
    enabled: !!selectedGroupId,
  })

  const {
    data: savedAttendanceData = [],
    refetch: refetchAttendance,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['attendance-records', selectedSessionId],
    queryFn: () =>
      selectedSessionId
        ? api
            .get('/attendance', { params: { session_id: selectedSessionId } })
            .then((r) => r.data?.data ?? [])
        : Promise.resolve([]),
    enabled: !!selectedSessionId,
  })

  const {
    data: groupAttendanceData = [],
    refetch: refetchGroupAttendance,
  } = useQuery({
    queryKey: ['group-attendance-records', selectedGroupId],
    queryFn: () =>
      selectedGroupId
        ? api
            .get('/attendance', { params: { group_id: selectedGroupId } })
            .then((r) => r.data?.data ?? [])
        : Promise.resolve([]),
    enabled: !!selectedGroupId,
  })

  useEffect(() => {
    if (!selectedSessionId) return

    const nextRecords: Record<number, string> = {}
    const nextNotes: Record<number, string> = {}

    savedAttendanceData.forEach((a: any) => {
      const studentId = a.student?.id ?? a.student_id ?? a.studentId

      if (studentId) {
        nextRecords[studentId] = a.status
        nextNotes[studentId] = a.note ?? ''
      }
    })

    if (savedAttendanceData.length > 0) {
      setRecords(nextRecords)
      setNotes(nextNotes)
    }
  }, [selectedSessionId, dataUpdatedAt])

  const saveMutation = useMutation({
    mutationFn: (payload: any) => api.post('/attendance/bulk', payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['attendance-records', selectedSessionId] })
      await qc.invalidateQueries({ queryKey: ['group-attendance-records', selectedGroupId] })
      await refetchAttendance()
      await refetchGroupAttendance()
      await qc.invalidateQueries({ queryKey: ['group-sessions', selectedGroupId] })

      alert('Présences enregistrées !')
    },
    onError: (err: any) => {
      console.error(err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const statuses = [
    { v: 'present', l: 'Présent', c: '#34d399' },
    { v: 'absent', l: 'Absent', c: '#f87171' },
    { v: 'late', l: 'Retard', c: '#fbbf24' },
    { v: 'excused', l: 'Excusé', c: '#60a5fa' },
  ]

  const handleSave = () => {
    if (!selectedSessionId) return alert('Choisissez une séance.')
    if (!students.length) return alert('Aucun étudiant dans ce groupe.')

    const recs = students.map((s: any) => ({
      student_id: s.id,
      status: records[s.id] ?? 'absent',
      note: notes[s.id] ?? '',
    }))

    saveMutation.mutate({
      session_id: selectedSessionId,
      records: recs,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Présences"
        subtitle="Choisissez un groupe, une séance, puis marquez les présences"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {groups.length === 0 && (
          <Card style={{ padding: 20 }}>
            <Empty message="Aucun groupe actif" />
          </Card>
        )}

        {groups.map((g: any) => (
          <Card
            key={g.id}
            style={{
              padding: 18,
              border:
                String(selectedGroupId) === String(g.id)
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
            }}
          >
            <div
              onClick={() => {
                setSelectedGroupId(String(g.id))
                setSelectedSessionId(null)
                setRecords({})
                setNotes({})
              }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</div>

              <div style={{ marginTop: 4, color: 'var(--text-muted)', fontSize: 13 }}>
                {g.course?.title ?? 'Sans cours'}
              </div>

              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                {g.teacher?.fullName ?? 'Enseignant N/A'} · {g.room ?? 'Salle N/A'}
              </div>

              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                {g.startTime?.slice(0, 5)} – {g.endTime?.slice(0, 5)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedGroupId && (
        <Card style={{ padding: 16 }}>
          <CardHeader>Séances du groupe : {selectedGroup?.name}</CardHeader>

          {sessions.length === 0 ? (
            <Empty message="Aucune séance générée pour ce groupe. Générez les séances dans Groupes." />
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12 }}>
              {sessions.map((s: any) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSessionId(s.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 99,
                    border:
                      selectedSessionId === s.id
                        ? '1px solid var(--accent)'
                        : '1px solid var(--border)',
                    background:
                      selectedSessionId === s.id
                        ? 'rgba(99,102,241,.2)'
                        : 'var(--bg-elevated)',
                    color:
                      selectedSessionId === s.id
                        ? 'var(--accent-light)'
                        : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {s.sessionDate ?? s.session_date ?? s.date}
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {selectedGroupId && selectedSessionId && (
        <Card>
          <CardHeader>
            {selectedGroup?.name} — séance{' '}
            {selectedSession?.sessionDate ?? selectedSession?.session_date ?? ''}
          </CardHeader>

          {students.length === 0 ? (
            <Empty message="Aucun étudiant inscrit dans ce groupe." />
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>Étudiant</Th>
                    <Th>Présence</Th>
                    <Th>Note du professeur</Th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s: any) => (
                    <Tr key={s.id}>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={s.fullName ?? s.first_name} size={30} />
                          <span style={{ fontWeight: 500 }}>
                            {s.fullName ?? `${s.first_name} ${s.last_name}`}
                          </span>
                        </div>
                      </Td>

                      <Td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {statuses.map((st) => (
                            <button
                              key={st.v}
                              type="button"
                              onClick={() =>
                                setRecords((r) => ({
                                  ...r,
                                  [s.id]: st.v,
                                }))
                              }
                              style={{
                                fontSize: 11,
                                padding: '5px 12px',
                                borderRadius: 99,
                                fontFamily: 'var(--font)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                background:
                                  records[s.id] === st.v
                                    ? `${st.c}22`
                                    : 'var(--bg-elevated)',
                                color:
                                  records[s.id] === st.v
                                    ? st.c
                                    : 'var(--text-muted)',
                                border:
                                  records[s.id] === st.v
                                    ? `1px solid ${st.c}66`
                                    : '1px solid var(--border)',
                              }}
                            >
                              {st.l}
                            </button>
                          ))}
                        </div>
                      </Td>

                      <Td>
                        <Input
                          placeholder="Ex: attentif, devoir non fait..."
                          value={notes[s.id] ?? ''}
                          onChange={(v) =>
                            setNotes((n) => ({
                              ...n,
                              [s.id]: v,
                            }))
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>

              <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {saveMutation.isPending
                    ? 'Enregistrement...'
                    : '✓ Enregistrer les présences'}
                </Button>
              </div>
            </>
          )}

          <Card style={{ marginTop: 20 }}>
            <CardHeader>Historique des présences du groupe</CardHeader>

            {groupAttendanceData.length === 0 ? (
              <Empty message="Aucun résultat enregistré pour ce groupe." />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Étudiant</Th>
                    <Th>Statut</Th>
                    <Th>Note du professeur</Th>
                  </tr>
                </thead>

                <tbody>
                  {groupAttendanceData.map((a: any) => (
                    <Tr key={a.id}>
                      <Td>{a.session?.sessionDate ?? '—'}</Td>

                      <Td>
                        {a.student?.fullName ??
                          `${a.student?.firstName ?? a.student?.first_name ?? ''} ${
                            a.student?.lastName ?? a.student?.last_name ?? ''
                          }`}
                      </Td>

                      <Td>{a.status}</Td>

                      <Td>{a.note || '—'}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Card>
      )}
    </div>
  )
}