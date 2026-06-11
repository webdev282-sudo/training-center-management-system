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
  Avatar,
  Empty,
  PaymentBadge,
} from '@/components/ui'

export default function PaymentsPage() {
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['payments', status],
    queryFn: () =>
      api.get('/payments', { params: { status } }).then((r) => r.data),
  })

  const addInstallment = useMutation({
    mutationFn: ({ id, amount, note }: any) =>
      api.post(`/payments/${id}/installments`, {
        amount,
        due_date: new Date().toISOString().slice(0, 10),
        note,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] })
      setSelected(null)
      setAmount('')
      setNote('')
    },
  })

  const printAllStudents = () => {
    window.open('http://127.0.0.1:8000/api/v1/students-payments',
    '_blank')
  }

  const filters = [
    { value: '', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'partial', label: 'Partiel' },
    { value: 'overdue', label: 'En retard' },
    { value: 'paid', label: 'Soldés' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Paiements"
        subtitle="Suivi des factures et versements"
        action={
          <Button onClick={printAllStudents}>
            Imprimer tous les étudiants
          </Button>
        }
      />

      <Card>
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              style={{
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: 99,
                fontFamily: 'var(--font)',
                fontWeight: 600,
                cursor: 'pointer',
                background:
                  status === f.value
                    ? 'linear-gradient(135deg,var(--accent),var(--accent-2))'
                    : '#fff',
                color: status === f.value ? '#fff' : 'var(--text-2)',
                border: status === f.value ? 'none' : '1px solid var(--border)',
                transition: 'all .2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Étudiant</Th>
                <Th>Cours</Th>
                <Th right>Total</Th>
                <Th right>Payé</Th>
                <Th right>Reste</Th>
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

              {data?.data?.map((p: any) => (
                <Tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={p.student?.fullName ?? 'U'} size={28} />
                      <span style={{ fontWeight: 600 }}>
                        {p.student?.fullName ?? '—'}
                      </span>
                    </div>
                  </Td>

                  <Td>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {p.enrollment?.group?.course?.title ?? '—'}
                    </span>
                  </Td>

                  <Td right>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                      {Number(p.totalAmount ?? 0).toLocaleString('fr-DZ')} DA
                    </span>
                  </Td>

                  <Td right>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 12,
                        color: '#10b981',
                      }}
                    >
                      {Number(p.paidAmount ?? 0).toLocaleString('fr-DZ')} DA
                    </span>
                  </Td>

                  <Td right>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 12,
                        color: p.remainingAmount > 0 ? '#ef4444' : '#10b981',
                        fontWeight: 700,
                      }}
                    >
                      {Number(p.remainingAmount ?? 0).toLocaleString('fr-DZ')} DA
                    </span>
                  </Td>

                  <Td>
                    <PaymentBadge status={p.paymentStatus ?? 'pending'} />
                  </Td>

                  <Td>
                    {p.paymentStatus !== 'paid' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelected(p)}
                      >
                        + Versement
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {selected && (
        <Modal
          title="Enregistrer un Versement"
          onClose={() => setSelected(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                padding: 14,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  TOTAL
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>
                  {Number(selected.totalAmount ?? 0).toLocaleString('fr-DZ')} DA
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  PAYÉ
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontWeight: 700,
                    color: '#10b981',
                  }}
                >
                  {Number(selected.paidAmount ?? 0).toLocaleString('fr-DZ')} DA
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  RESTE
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontWeight: 700,
                    color: '#ef4444',
                  }}
                >
                  {Number(selected.remainingAmount ?? 0).toLocaleString('fr-DZ')} DA
                </div>
              </div>
            </div>

            <FormField label="Montant (DA)">
              <Input
                type="number"
                placeholder={`Max: ${Number(
                  selected.remainingAmount ?? 0
                ).toLocaleString('fr-DZ')}`}
                value={amount}
                onChange={setAmount}
              />
            </FormField>

            <FormField label="Note (optionnel)">
              <Input
                placeholder="Ex: 1er versement mensuel"
                value={note}
                onChange={setNote}
              />
            </FormField>

            <div
              style={{
                fontSize: 11,
                color: 'var(--text-3)',
                background: '#fff',
                border: '1px solid var(--border)',
                padding: '8px 12px',
                borderRadius: 'var(--r-sm)',
              }}
            >
              Mode : <strong>Espèces</strong> · Date :{' '}
              <strong>{new Date().toLocaleDateString('fr-DZ')}</strong>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant="ghost"
                onClick={() => setSelected(null)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Annuler
              </Button>

              <Button
                disabled={!amount || addInstallment.isPending}
                onClick={() =>
                  addInstallment.mutate({
                    id: selected.id,
                    amount: parseFloat(amount),
                    note,
                  })
                }
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {addInstallment.isPending ? 'Enregistrement...' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}