
'use client'
import { useState } from 'react'
import { useAddInstallment } from '@/hooks/usePayments'
import type { Payment } from '@/types'
 
interface Props {
  payment: Payment
  onClose: () => void
}
 
export function AddInstallmentModal({ payment, onClose }: Props) {
  const [amount, setAmount]   = useState('')
  const [note, setNote]       = useState('')
  const mutation              = useAddInstallment(payment.id)
 
  const max = payment.remainingAmount
 
  const handleSubmit = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0 || amt > max) return
    await mutation.mutateAsync({
      amount: amt,
      due_date: new Date().toISOString().slice(0, 10),
      note,
    })
    onClose()
  }
 
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">Enregistrer un versement</h2>
          <p className="text-xs text-gray-400 mt-0.5">{payment.student?.fullName}</p>
        </div>
 
        <div className="p-6 space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-3 gap-3 text-center text-xs">
            <div><p className="text-gray-400">Total</p><p className="font-medium">{payment.totalAmount.toLocaleString('fr-DZ')} DA</p></div>
            <div><p className="text-gray-400">Déjà payé</p><p className="font-medium text-green-600">{payment.paidAmount.toLocaleString('fr-DZ')} DA</p></div>
            <div><p className="text-gray-400">Reste</p><p className="font-medium text-red-600">{max.toLocaleString('fr-DZ')} DA</p></div>
          </div>
 
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Montant versé (max {max.toLocaleString('fr-DZ')} DA)</label>
            <input
              type="number" min="1" max={max} value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Ex: 5000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
 
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Note (optionnel)</label>
            <input
              type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ex: 1er versement mensuel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
 
          <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-600">
            Mode de paiement : <strong>Espèces</strong> · Date : <strong>{new Date().toLocaleDateString('fr-DZ')}</strong>
          </div>
        </div>
 
        <div className="px-6 pb-5 flex gap-2">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={mutation.isPending || !amount}
            className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors font-medium">
            {mutation.isPending ? 'Enregistrement...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}