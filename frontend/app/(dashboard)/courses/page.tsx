'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/lib/api'

import {
  PageHeader,
  Card,
  Table,
  Th,
  Tr,
  Td,
  Button,
  Modal,
  FormField,
  Input,
  Empty,
  Badge,
} from '@/components/ui'

export default function CoursesPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)

  const [form, setForm] = useState({
    domain_name: '',
    title: '',
    duration: '',
    price: '',
    level: '',
    sessions_count: '',
    description: '',
  })

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (d: any) => api.post('/courses', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] })
      setShowCreate(false)
      setForm({
        domain_name: '',
        title: '',
        duration: '',
        price: '',
        level: '',
        sessions_count: '',
        description: '',
      })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/courses/${id}/toggle-status`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })

  const handleCreateCourse = async () => {
    try {
      const domainRes = await api.post('/domains', {
        name: form.domain_name,
      })

      const domainId = domainRes.data?.data?.id ?? domainRes.data?.id

      if (!domainId) {
        alert('لم يتم إنشاء الدومان')
        console.error('Domain response:', domainRes.data)
        return
      }

      await createMutation.mutateAsync({
        domain_id: domainId,
        title: form.title,
        duration: form.duration,
        price: parseFloat(form.price),
        level: form.level || null,
        sessions_count: form.sessions_count
          ? parseInt(form.sessions_count)
          : null,
        description: form.description || null,
      })
    } catch (err: any) {
      console.error('CREATE COURSE ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Formations"
        subtitle={`${courses?.meta?.total ?? 0} formations disponibles`}
        action={
          <Button onClick={() => setShowCreate(true)}>
            + Nouvelle Formation
          </Button>
        }
      />

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Titre</Th>
              <Th>Domaine</Th>
              <Th>Durée</Th>
              <Th>Séances</Th>
              <Th right>Prix</Th>
              <Th>Niveau</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {courses?.data?.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <Empty />
                </td>
              </tr>
            )}

            {courses?.data?.map((c: any) => (
              <Tr key={c.id}>
                <Td>
                  <span style={{ fontWeight: 500 }}>{c.title}</span>
                </Td>

                <Td>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {c.domain?.name ?? '—'}
                  </span>
                </Td>

                <Td>
                  <span style={{ fontSize: 12 }}>{c.duration}</span>
                </Td>

                <Td>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                    {c.sessionsCount ?? '—'}
                  </span>
                </Td>

                <Td right>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {Number(c.price).toLocaleString('fr-DZ')} DA
                  </span>
                </Td>

                <Td>
                  <Badge variant="purple">{c.level ?? '—'}</Badge>
                </Td>

                <Td>
                  <Badge variant={c.status ? 'success' : 'default'}>
                    {c.status ? 'Actif' : 'Inactif'}
                  </Badge>
                </Td>

                <Td>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleMutation.mutate(c.id)}
                  >
                    {c.status ? 'Désactiver' : 'Activer'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {showCreate && (
        <Modal title="Nouvelle Formation" onClose={() => setShowCreate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Domaine *">
              <Input
                placeholder="Ex: Langues, Informatique..."
                value={form.domain_name}
                onChange={(v) =>
                  setForm((f) => ({ ...f, domain_name: v }))
                }
              />
            </FormField>

            <FormField label="Titre *">
              <Input
                placeholder="Ex: Anglais B2"
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              />
            </FormField>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <FormField label="Durée *">
                <Input
                  placeholder="Ex: 3 mois"
                  value={form.duration}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, duration: v }))
                  }
                />
              </FormField>

              <FormField label="Prix (DA) *">
                <Input
                  type="number"
                  placeholder="18000"
                  value={form.price}
                  onChange={(v) => setForm((f) => ({ ...f, price: v }))}
                />
              </FormField>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
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
                  !form.domain_name ||
                  !form.title ||
                  !form.duration ||
                  !form.price
                }
                onClick={handleCreateCourse}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {createMutation.isPending ? 'Création...' : 'Créer Formation'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}