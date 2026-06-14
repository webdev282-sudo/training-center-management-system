
'use client'

import { useState } from 'react'
import { useAddInstallment } from '@/hooks/usePayments'
import type { Payment } from '@/types'

interface Props {
  payment: Payment
  onClose: () => void
}

export function AddInstallmentModal({ payment, onClose }: Props) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const mutation = useAddInstallment(payment.id)

  const max = Number(payment.remainingAmount ?? 0)
  const total = Number(payment.totalAmount ?? 0)
  const paid = Number(payment.paidAmount ?? 0)

  const handleSubmit = async () => {
    const amt = Number(amount)

    if (!amt || amt <= 0 || amt > max) return

    await mutation.mutateAsync({
      amount: amt,
      due_date: new Date().toISOString().slice(0, 10),
      note,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl">
        <div className="border-b border-slate-200/70 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-extrabold tracking-[-0.03em] text-slate-950">
                Enregistrer un versement
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                {payment.student?.fullName ?? 'Étudiant'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 text-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total</p>
              <p className="mt-1 text-xs font-extrabold text-slate-900">
                {total.toLocaleString('fr-DZ')} DA
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Payé</p>
              <p className="mt-1 text-xs font-extrabold text-emerald-600">
                {paid.toLocaleString('fr-DZ')} DA
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Reste</p>
              <p className="mt-1 text-xs font-extrabold text-red-500">
                {max.toLocaleString('fr-DZ')} DA
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-500">
              Montant versé
              <span className="ml-1 font-medium text-slate-400">
                max {max.toLocaleString('fr-DZ')} DA
              </span>
            </label>

            <input
              type="number"
              min="1"
              max={max}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 5000"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-500">
              Note <span className="font-medium text-slate-400">(optionnel)</span>
            </label>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: 1er versement mensuel"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 text-xs font-semibold text-indigo-700">
            Mode de paiement : <strong>Espèces</strong>
            <span className="mx-2 text-indigo-300">•</span>
            Date : <strong>{new Date().toLocaleDateString('fr-DZ')}</strong>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending || !amount}
            type="button"
            className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(99,91,255,0.28)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? 'Enregistrement...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}