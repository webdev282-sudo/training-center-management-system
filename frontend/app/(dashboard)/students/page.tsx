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
  Avatar,
  StatusBadge,
  PaymentBadge,
  Button,
  Input,
  PageHeader,
  Modal,
  FormField,
  Empty,
} from '@/components/ui'

export default function StudentsPage() {
  const qc = useQueryClient()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<any>(null)
  const [showCreate, setShowCreate] = useState(false)

  const [enrollStudent, setEnrollStudent] = useState<any>(null)
  const [selectedGroupId, setSelectedGroupId] = useState('')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    gender: '',
    notes: '',
  })

  const [formErrors, setFormErrors] = useState<any>({})

  const { data, isLoading } = useQuery({
    queryKey: ['students', search, status, page],
    queryFn: () =>
      api.get('/students', { params: { search, status, page } }).then((r) => r.data),
  })

  const { data: groups = [] } = useQuery({
    queryKey: ['groups-list-active'],
    queryFn: () =>
      api.get('/groups?status=active').then((r) => r.data?.data ?? []),
  })

  const createMutation = useMutation({
    mutationFn: (d: any) => api.post('/students', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      setShowCreate(false)
      setForm({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        gender: '',
        notes: '',
      })
    },
    onError: (err: any) => {
      const e = err.response?.data?.errors ?? {}
      const flat: any = {}
      Object.entries(e).forEach(([k, v]) => {
        flat[k] = (v as string[])[0]
      })
      setFormErrors(flat)
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/students/${id}/archive`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
  const restoreMutation = useMutation({
  mutationFn: (id: number) => api.patch(`/students/${id}/restore`),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['students'] })
    setSelected(null)
  },
})

  const enrollMutation = useMutation({
    mutationFn: (payload: { student_id: number; group_id: number }) =>
      api.post('/enrollments', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['groups'] })
      qc.invalidateQueries({ queryKey: ['groups-list-active'] })

      setEnrollStudent(null)
      setSelectedGroupId('')
      alert('Étudiant inscrit au groupe avec succès.')
    },
    onError: (err: any) => {
      console.error('ENROLL ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )

  const statusFilters = [
    { value: '', label: 'Tous' },
    { value: 'active', label: 'Actifs' },
    { value: 'completed', label: 'Terminés' },
    { value: 'archived', label: 'Archivés' },
  ]

  const handleEnroll = () => {
    if (!enrollStudent || !selectedGroupId) return

    enrollMutation.mutate({
      student_id: enrollStudent.id,
      group_id: parseInt(selectedGroupId),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Étudiants"
        subtitle={`${data?.meta?.total ?? 0} étudiant(s) enregistré(s)`}
        action={<Button onClick={() => setShowCreate(true)}>+ Ajouter Étudiant</Button>}
      />

      <Card>
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
              placeholder="Rechercher par nom, code, téléphone..."
              value={search}
              onChange={(v) => {
                setSearch(v)
                setPage(1)
              }}
              icon={<SearchIcon />}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setStatus(f.value)
                  setPage(1)
                }}
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background:
                    status === f.value
                      ? 'linear-gradient(135deg,var(--accent),#4f46e5)'
                      : 'var(--bg-elevated)',
                  color: status === f.value ? '#fff' : 'var(--text-secondary)',
                  border: status === f.value ? 'none' : '1px solid var(--border)',
                  transition: 'all .2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 44 }} />
            ))}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Étudiant</Th>
                <Th>Téléphone</Th>
                <Th>Groupe / Cours</Th>
                <Th>Paiement</Th>
                <Th>Statut</Th>
                <Th>Actions</Th>
              </tr>
            </thead>

            <tbody>
              {data?.data?.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <Empty />
                  </td>
                </tr>
              )}

              {data?.data?.map((s: any) => (
                <Tr key={s.id} onClick={() => setSelected(s)}>
                  <Td mono>{s.studentCode}</Td>

                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.fullName} size={30} />
                      <span style={{ fontWeight: 500 }}>{s.fullName}</span>
                    </div>
                  </Td>

                  <Td>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.phone}</span>
                  </Td>

                  <Td>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {s.activeGroups?.[0]?.course?.title ?? '—'}
                    </span>
                  </Td>

                  <Td>
                    {s.paymentStatus ? (
                      <PaymentBadge status={s.paymentStatus} />
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </Td>

                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>

                  <Td>
                    <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" onClick={() => setSelected(s)}>
                        Voir
                      </Button>

                      {s.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEnrollStudent(s)
                            setSelectedGroupId('')
                          }}
                        >
                          Inscrire
                        </Button>
                      )}

                      {s.status === 'active' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => archiveMutation.mutate(s.id)}
                        >
                          Archiver
                        </Button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}

        {data?.meta?.lastPage > 1 && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {data.meta.total} résultats
            </span>

            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                ← Préc.
              </Button>

              <span style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '6px 12px' }}>
                {page} / {data.meta.lastPage}
              </span>

              <Button
                size="sm"
                variant="ghost"
                disabled={page === data.meta.lastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Suiv. →
              </Button>
            </div>
          </div>
        )}
      </Card>

      {showCreate && (
        <Modal title="Nouvel Étudiant" onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Prénom *" error={formErrors.first_name}>
                <Input
                  placeholder="Kenza"
                  value={form.first_name}
                  onChange={(v) => setForm((f) => ({ ...f, first_name: v }))}
                />
              </FormField>

              <FormField label="Nom *" error={formErrors.last_name}>
                <Input
                  placeholder="Aït Yahia"
                  value={form.last_name}
                  onChange={(v) => setForm((f) => ({ ...f, last_name: v }))}
                />
              </FormField>
            </div>

            <FormField label="Téléphone *" error={formErrors.phone}>
              <Input
                placeholder="0770 000 000"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              />
            </FormField>

            <FormField label="Email" error={formErrors.email}>
              <Input
                placeholder="email@exemple.com"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              />
            </FormField>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Button
                variant="ghost"
                onClick={() => setShowCreate(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Annuler
              </Button>

              <Button
                disabled={createMutation.isPending}
                onClick={() => createMutation.mutate(form)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {createMutation.isPending ? 'Création...' : 'Créer Étudiant'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {enrollStudent && (
        <Modal title="Inscrire au groupe" onClose={() => setEnrollStudent(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Étudiant:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {enrollStudent.fullName}
              </strong>
            </div>

            <FormField label="Groupe *">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
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
                <option value="">Sélectionner un groupe...</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.course?.title ?? 'Sans cours'}
                  </option>
                ))}
              </select>
            </FormField>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Button
                variant="ghost"
                onClick={() => setEnrollStudent(null)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Annuler
              </Button>

              <Button
                disabled={!selectedGroupId || enrollMutation.isPending}
                onClick={handleEnroll}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {enrollMutation.isPending ? 'Inscription...' : 'Inscrire'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {selected && (
  <Modal title="Détails étudiant" onClose={() => setSelected(null)}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={selected.fullName} size={44} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {selected.fullName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {selected.studentCode}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Téléphone">
          <div>{selected.phone ?? '—'}</div>
        </FormField>

        <FormField label="Email">
          <div>{selected.email ?? '—'}</div>
        </FormField>

        <FormField label="Statut">
          <StatusBadge status={selected.status} />
        </FormField>

        <FormField label="Paiement">
          {selected.paymentStatus ? (
            <PaymentBadge status={selected.paymentStatus} />
          ) : (
            <span>—</span>
          )}
        </FormField>
      </div>

      <FormField label="Groupes / Formations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {selected.formations?.length ? (
            selected.formations.map((f: any) => (
              <div
                key={f.id + f.group}
                style={{
                  padding: '8px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  background: 'var(--bg-elevated)',
                  fontSize: 13,
                }}
              >
                {f.title} — {f.group}
              </div>
            ))
          ) : selected.activeGroups?.length ? (
            selected.activeGroups.map((g: any) => (
              <div
                key={g.id}
                style={{
                  padding: '8px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  background: 'var(--bg-elevated)',
                  fontSize: 13,
                }}
              >
                {g.name} — {g.course?.title ?? 'Sans cours'}
              </div>
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              Aucun groupe
            </span>
          )}
        </div>
      </FormField>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
  <Button
    variant="ghost"
    onClick={() => setSelected(null)}
    style={{ flex: 1, justifyContent: 'center' }}
  >
    Fermer
  </Button>

  {selected.status === 'archived' && (
    <Button
      onClick={() => restoreMutation.mutate(selected.id)}
      style={{ flex: 1, justifyContent: 'center' }}
    >
      Réactiver
    </Button>
  )}

        {selected.status === 'active' && (
          <Button
            onClick={() => {
              setEnrollStudent(selected)
              setSelected(null)
              setSelectedGroupId('')
            }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Inscrire à un groupe
          </Button>
        )}
      </div>
    </div>
  </Modal>
)}
    </div>
  )
}