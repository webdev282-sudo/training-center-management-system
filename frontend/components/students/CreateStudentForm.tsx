'use client'

import { useState } from 'react'
import { useCreateStudent } from '@/hooks/useStudents'

interface Props {
  onSuccess?: () => void
  onCancel?: () => void
}

type StudentFormState = {
  first_name: string
  last_name: string
  gender: '' | 'F' | 'M'
  phone: string
  email: string
  birth_date: string
  education_level: string
  notes: string
}

export function CreateStudentForm({ onSuccess, onCancel }: Props) {
  const mutation = useCreateStudent()

  const [form, setForm] = useState<StudentFormState>({
    first_name: '',
    last_name: '',
    gender: '',
    phone: '',
    email: '',
    birth_date: '',
    education_level: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: keyof StudentFormState, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(form)
      onSuccess?.()
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors ?? {}
      const flat: Record<string, string> = {}

      Object.entries(apiErrors).forEach(([k, v]) => {
        flat[k] = (v as string[])[0]
      })

      setErrors(flat)
    }
  }

  const field = (
    key: keyof StudentFormState,
    label: string,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-300 focus:ring-4 ${
          errors[key]
            ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
            : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10'
        }`}
      />

      {errors[key] && (
        <p className="mt-1.5 text-xs font-semibold text-red-500">
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
        <p className="text-sm font-extrabold text-slate-900">
          Nouveau dossier étudiant
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Ajoutez les informations principales de l’étudiant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {field('first_name', 'Prénom *', 'text', 'Kenza')}
        {field('last_name', 'Nom *', 'text', 'Aït Yahia')}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {field('phone', 'Téléphone *', 'tel', '0770 000 000')}
        {field('email', 'Email', 'email', 'kenza@email.com')}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-500">
            Genre
          </label>

          <select
            value={form.gender}
            onChange={(e) => set('gender', e.target.value as '' | 'F' | 'M')}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.04)] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="">—</option>
            <option value="F">Féminin</option>
            <option value="M">Masculin</option>
          </select>
        </div>

        {field('birth_date', 'Date de naissance', 'date')}
      </div>

      {field('education_level', "Niveau d'études", 'text', 'Baccalauréat')}

      <div>
        <label className="mb-2 block text-xs font-bold text-slate-500">
          Notes
        </label>

        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={3}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
          placeholder="Informations complémentaires..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          type="button"
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
        >
          Annuler
        </button>

        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          type="button"
          className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(99,91,255,0.28)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? 'Création...' : "Créer l'étudiant"}
        </button>
      </div>
    </div>
  )
}