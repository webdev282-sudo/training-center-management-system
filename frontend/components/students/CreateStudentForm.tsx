'use client'
import { useState } from 'react'
import { useCreateStudent } from '@/hooks/useStudents'
 
interface Props {
  onSuccess?: () => void
  onCancel?: () => void
}
 
export function CreateStudentForm({ onSuccess, onCancel }: Props) {
  const mutation = useCreateStudent()
  const [form, setForm] = useState({
    first_name: '', last_name: '', gender: '', phone: '',
    email: '', birth_date: '', education_level: '', notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
 
  const set = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }
 
  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(form)
      onSuccess?.()
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors ?? {}
      const flat: Record<string, string> = {}
      Object.entries(apiErrors).forEach(([k, v]) => { flat[k] = (v as string[])[0] })
      setErrors(flat)
    }
  }
 
  const field = (key: string, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300
          ${errors[key] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )
 
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {field('first_name', 'Prénom *', 'text', 'Kenza')}
        {field('last_name',  'Nom *',    'text', 'Aït Yahia')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('phone', 'Téléphone *', 'tel', '0770 000 000')}
        {field('email', 'Email',       'email', 'kenza@email.com')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Genre</label>
          <select value={form.gender} onChange={e => set('gender', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">—</option>
            <option value="F">Féminin</option>
            <option value="M">Masculin</option>
          </select>
        </div>
        {field('birth_date', 'Date de naissance', 'date')}
      </div>
      {field('education_level', 'Niveau d\'études', 'text', 'Baccalauréat')}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Informations complémentaires..." />
      </div>
 
      <div className="flex gap-2 pt-2">
        <button onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={mutation.isPending}
          className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors font-medium">
          {mutation.isPending ? 'Création...' : 'Créer l\'étudiant'}
        </button>
      </div>
    </div>
  )
}