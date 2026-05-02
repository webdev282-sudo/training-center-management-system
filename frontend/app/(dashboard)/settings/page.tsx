'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import api from '@/lib/api'

import {
  PageHeader,
  Card,
  FormField,
  Input,
  Button,
} from '@/components/ui'

export default function SettingsPage() {
  const [centerName, setCenterName] = useState('')
  const [currency, setCurrency] = useState('')
  const [lang, setLang] = useState('fr')
  const [saved, setSaved] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data),
  })

  useEffect(() => {
    if (!data) return

    setCenterName(data.center_name ?? '')
    setCurrency(data.currency ?? '')
    setLang(data.default_language ?? 'fr')
  }, [data])

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put('/settings', {
        center_name: centerName,
        currency,
        default_language: lang,
      }),
    onSuccess: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: (err: any) => {
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
      <PageHeader
        title="Paramètres"
        subtitle="Configuration du centre de formation"
      />

      <Card style={{ padding: 24 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--accent-light)',
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '.5px',
          }}
        >
          Informations du centre
        </div>

        {isLoading ? (
          <div style={{ color: 'var(--text-muted)', padding: 12 }}>
            Chargement...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Nom du centre">
              <Input value={centerName} onChange={setCenterName} />
            </FormField>

            <FormField label="Devise">
              <Input value={currency} onChange={setCurrency} />
            </FormField>

            <FormField label="Langue par défaut">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
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
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </FormField>

            <Button
              disabled={updateMutation.isPending}
              onClick={() => updateMutation.mutate()}
              style={{ width: 'fit-content' }}
            >
              {updateMutation.isPending
                ? 'Enregistrement...'
                : saved
                  ? '✓ Enregistré !'
                  : 'Enregistrer les modifications'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}