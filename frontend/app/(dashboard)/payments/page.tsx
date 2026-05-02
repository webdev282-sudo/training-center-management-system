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

  const filters = [
    { value: '', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'partial', label: 'Partiel' },
    { value: 'overdue', label: 'En retard' },
    { value: 'paid', label: 'Soldés' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Paiements" subtitle="Suivi des factures et versements" />

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
                      <span style={{ fontWeight: 500 }}>
                        {p.student?.fullName}
                      </span>
                    </div>
                  </Td>

                  <Td>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {p.enrollment?.group?.course?.title ?? '—'}
                    </span>
                  </Td>

                  <Td right>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                      {Number(p.totalAmount).toLocaleString('fr-DZ')} DA
                    </span>
                  </Td>

                  <Td right>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 12,
                        color: '#34d399',
                      }}
                    >
                      {Number(p.paidAmount).toLocaleString('fr-DZ')} DA
                    </span>
                  </Td>

                  <Td right>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 12,
                        color:
                          p.remainingAmount > 0 ? '#f87171' : '#34d399',
                        fontWeight: 600,
                      }}
                    >
                      {Number(p.remainingAmount).toLocaleString('fr-DZ')} DA
                    </span>
                  </Td>

                  <Td>
                    <PaymentBadge status={p.paymentStatus} />
                  </Td>

                  <Td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.paymentStatus !== 'paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelected(p)}
                        >
                          + Versement
                        </Button>
                      )}

                      <a
                        href={`/api/v1/reports/payment/${p.id}/receipt`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                        }}
                      >
                        PDF
                      </a>
                    </div>
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
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--r-sm)',
                padding: 14,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  TOTAL
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>
                  {Number(selected.totalAmount).toLocaleString('fr-DZ')} DA
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  PAYÉ
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontWeight: 700,
                    color: '#34d399',
                  }}
                >
                  {Number(selected.paidAmount).toLocaleString('fr-DZ')} DA
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  RESTE
                </div>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontWeight: 700,
                    color: '#f87171',
                  }}
                >
                  {Number(selected.remainingAmount).toLocaleString('fr-DZ')} DA
                </div>
              </div>
            </div>

            <FormField label="Montant (DA)">
              <Input
               type="number"
               placeholder={`Max: ${Number(
               selected.remainingAmount
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
                color: 'var(--text-muted)',
                background: 'var(--bg-elevated)',
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
                {addInstallment.isPending
                  ? 'Enregistrement...'
                  : 'Confirmer'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}