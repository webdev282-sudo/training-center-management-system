'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/lib/api'

import {
  Card,
  Table,
  Th,
  Td,
  Tr,
  Button,
  Badge,
  ProgressBar,
  PageHeader,
  Modal,
  FormField,
  Input,
  Empty,
} from '@/components/ui'

export default function GroupsPage() {
  const qc = useQueryClient()

  const [showCreate, setShowCreate] = useState(false)

  const [form, setForm] = useState({
    course_id: '',
    teacher_id: '',
    name: '',
    room: '',
    start_date: '',
    end_date: '',
    days: [] as string[],
    start_time: '09:00',
    end_time: '11:00',
    capacity: '20',
  })

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.get('/groups').then((r) => r.data),
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => api.get('/courses').then((r) => r.data?.data ?? []),
  })

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers-list'],
    queryFn: () => api.get('/teachers').then((r) => r.data?.data ?? []),
  })

  const createMutation = useMutation({
    mutationFn: (d: any) => api.post('/groups', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] })
      setShowCreate(false)
      setForm({
        course_id: '',
        teacher_id: '',
        name: '',
        room: '',
        start_date: '',
        end_date: '',
        days: [],
        start_time: '09:00',
        end_time: '11:00',
        capacity: '20',
      })
    },
    onError: (err: any) => {
      console.error('CREATE GROUP ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/groups/${id}/complete`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (err: any) => {
      console.error('COMPLETE GROUP ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const generateSessions = useMutation({
    mutationFn: (id: number) => {
      console.log('GENERATE GROUP ID:', id)
      return api.post(`/groups/${id}/generate-sessions`)
    },
    onSuccess: (d) => {
      alert(d.data.message)
      qc.invalidateQueries({ queryKey: ['groups'] })
      qc.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: (err: any) => {
      console.error('GENERATE SESSIONS ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

  const toggleDay = (day: string) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day)
        ? f.days.filter((x) => x !== day)
        : [...f.days, day],
    }))
  }

  const handleCreateGroup = () => {
    createMutation.mutate({
      course_id: parseInt(form.course_id),
      teacher_id: parseInt(form.teacher_id),
      name: form.name,
      room: form.room || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      days: form.days,
      start_time: form.start_time,
      end_time: form.end_time,
      capacity: parseInt(form.capacity),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Groupes"
        subtitle={`${groups?.meta?.total ?? 0} groupe(s)`}
        action={
          <Button onClick={() => setShowCreate(true)}>
            + Nouveau Groupe
          </Button>
        }
      />

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Groupe</Th>
              <Th>Cours</Th>
              <Th>Enseignant</Th>
              <Th>Horaires</Th>
              <Th>Capacité</Th>
              <Th>Progression</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {groups?.data?.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <Empty />
                </td>
              </tr>
            )}

            {groups?.data?.map((g: any) => (
              <Tr key={g.id}>
                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 600 }}>{g.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      ID: {g.id}
                    </span>
                  </div>
                </Td>

                <Td>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {g.course?.title}
                  </span>
                </Td>

                <Td>
                  <span style={{ fontSize: 12 }}>{g.teacher?.fullName}</span>
                </Td>

                <Td>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--mono)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {g.startTime}–{g.endTime}
                  </span>
                </Td>

                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>
                      {g.enrolledCount}/{g.capacity}
                    </span>

                    <ProgressBar
                      value={g.enrolledCount}
                      max={g.capacity}
                      color={g.enrolledCount >= g.capacity ? '#ef4444' : 'var(--accent)'}
                    />
                  </div>
                </Td>

                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>
                      {g.progressPercent}%
                    </span>

                    <ProgressBar
                      value={g.progressPercent}
                      max={100}
                      color="#10b981"
                    />
                  </div>
                </Td>

                <Td>
                  <Badge
                    variant={
                      g.status === 'active'
                        ? 'success'
                        : g.status === 'completed'
                          ? 'info'
                          : 'default'
                    }
                  >
                    {g.status}
                  </Badge>
                </Td>

                <Td>
                  <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => generateSessions.mutate(g.id)}
                      disabled={generateSessions.isPending || g.status !== 'active'}
                    >
                      ↺ Séances
                    </Button>

                    {g.status === 'active' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => completeMutation.mutate(g.id)}
                        disabled={completeMutation.isPending}
                      >
                        Terminer
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {showCreate && (
        <Modal title="Nouveau Groupe" onClose={() => setShowCreate(false)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <FormField label="Cours *">
              <select
                value={form.course_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, course_id: e.target.value }))
                }
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '9px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontFamily: 'var(--font)',
                  width: '100%',
                }}
              >
                <option value="">Sélectionner...</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Enseignant *">
              <select
                value={form.teacher_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, teacher_id: e.target.value }))
                }
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '9px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontFamily: 'var(--font)',
                  width: '100%',
                }}
              >
                <option value="">Sélectionner...</option>
                {teachers.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </FormField>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <FormField label="Nom du groupe *">
                <Input
                  placeholder="Anglais B2 - G1"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                />
              </FormField>

              <FormField label="Salle">
                <Input
                  placeholder="Salle A"
                  value={form.room}
                  onChange={(v) => setForm((f) => ({ ...f, room: v }))}
                />
              </FormField>

              <FormField label="Date début *">
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(v) => setForm((f) => ({ ...f, start_date: v }))}
                />
              </FormField>

              <FormField label="Date fin">
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(v) => setForm((f) => ({ ...f, end_date: v }))}
                />
              </FormField>

              <FormField label="Heure début *">
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={(v) => setForm((f) => ({ ...f, start_time: v }))}
                />
              </FormField>

              <FormField label="Heure fin *">
                <Input
                  type="time"
                  value={form.end_time}
                  onChange={(v) => setForm((f) => ({ ...f, end_time: v }))}
                />
              </FormField>
            </div>

            <FormField label="Capacité *">
              <Input
                type="number"
                value={form.capacity}
                onChange={(v) => setForm((f) => ({ ...f, capacity: v }))}
              />
            </FormField>

            <FormField label="Jours *">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    style={{
                      fontSize: 11,
                      padding: '5px 12px',
                      borderRadius: 99,
                      fontFamily: 'var(--font)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      background: form.days.includes(day)
                        ? 'rgba(99,102,241,.2)'
                        : 'var(--bg-elevated)',
                      color: form.days.includes(day)
                        ? 'var(--accent-light)'
                        : 'var(--text-muted)',
                      border: form.days.includes(day)
                        ? '1px solid rgba(99,102,241,.5)'
                        : '1px solid var(--border)',
                      transition: 'all .15s',
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </FormField>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <Button
                variant="ghost"
                onClick={() => setShowCreate(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Annuler
              </Button>

              <Button
                disabled={
                  createMutation.isPending ||
                  !form.course_id ||
                  !form.teacher_id ||
                  !form.name ||
                  !form.start_date ||
                  !form.start_time ||
                  !form.end_time ||
                  form.days.length === 0
                }
                onClick={handleCreateGroup}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {createMutation.isPending ? 'Création...' : 'Créer Groupe'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}