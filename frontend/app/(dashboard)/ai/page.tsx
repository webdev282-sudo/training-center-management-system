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
  Empty,
  Avatar,
  RiskBadge,
  Input,
} from '@/components/ui'

type Tab = 'risk' | 'assistant' | 'knowledge'

export default function AiPage() {
  const qc = useQueryClient()

  const [level, setLevel] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [tab, setTab] = useState<Tab>('risk')

  const [knowledgeForm, setKnowledgeForm] = useState({
    title: '',
    category: '',
    content: '',
    keywords: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['risk', level],
    queryFn: () =>
      api.get('/ai/risk-analyses', { params: { level } }).then((r) => r.data),
  })

  const { data: knowledgeData, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['ai-knowledge'],
    queryFn: () =>
      api.get('/ai/assistant/knowledge').then((r) => r.data.data),
  })

  const analyzeAll = useMutation({
    mutationFn: () => api.post('/ai/analyze-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['risk'] }),
    onError: (err: any) => {
      console.error('ANALYZE ALL ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const askAI = useMutation({
    mutationFn: (q: string) =>
      api.post('/ai/assistant', { question: q }).then((r) => r.data.data),
    onSuccess: (d: any) => setAnswer(d.answer),
    onError: (err: any) => {
      console.error('ASK AI ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const createKnowledge = useMutation({
    mutationFn: () =>
      api.post('/ai/assistant/knowledge', {
        title: knowledgeForm.title.trim(),
        category: knowledgeForm.category.trim() || null,
        content: knowledgeForm.content.trim(),
        keywords: knowledgeForm.keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ai-knowledge'] })
      setKnowledgeForm({
        title: '',
        category: '',
        content: '',
        keywords: '',
      })
      alert('Information enregistrée avec succès.')
    },
    onError: (err: any) => {
      console.error('KNOWLEDGE SAVE ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const deleteKnowledge = useMutation({
    mutationFn: (id: number) => api.delete(`/ai/assistant/knowledge/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ai-knowledge'] }),
    onError: (err: any) => {
      console.error('KNOWLEDGE DELETE ERROR:', err.response?.data ?? err)
      alert(JSON.stringify(err.response?.data ?? err.message))
    },
  })

  const tabs = [
    { k: 'risk', l: "Risque d'abandon" },
    { k: 'assistant', l: 'Assistant IA' },
    { k: 'knowledge', l: 'Base de connaissance' },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="IA Insights"
        subtitle="Analyse intelligente et assistant administratif"
      />

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              fontSize: 13,
              padding: '10px 20px',
              fontFamily: 'var(--font)',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottom:
                tab === t.k ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.k ? 'var(--accent)' : 'var(--text-2)',
              transition: 'all .2s',
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'risk' && (
        <>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { v: '', l: 'Tous' },
              { v: 'high', l: 'Risque Élevé' },
              { v: 'medium', l: 'Moyen' },
              { v: 'low', l: 'Faible' },
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => setLevel(f.v)}
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontFamily: 'var(--font)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background:
                    level === f.v
                      ? 'linear-gradient(135deg,var(--accent),var(--accent-2))'
                      : '#fff',
                  color: level === f.v ? '#fff' : 'var(--text-2)',
                  border: level === f.v ? 'none' : '1px solid var(--border)',
                  transition: 'all .2s',
                }}
              >
                {f.l}
              </button>
            ))}

            <Button
              variant="ghost"
              onClick={() => analyzeAll.mutate()}
              disabled={analyzeAll.isPending}
              style={{ marginLeft: 'auto' }}
            >
              {analyzeAll.isPending ? 'Analyse...' : '↻ Analyser Tous'}
            </Button>
          </div>

          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Cette analyse identifie les étudiants nécessitant un suivi selon leur
              assiduité, leurs paiements et leur progression.
            </div>
          </Card>

          <Card>
            {isLoading ? (
              <div style={{ padding: 24 }}>
                <div className="skeleton" style={{ height: 200 }} />
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Étudiant</Th>
                    <Th>Absences</Th>
                    <Th>Paiements</Th>
                    <Th>Progression</Th>
                    <Th>Score Total</Th>
                    <Th>Niveau</Th>
                    <Th>Recommandation</Th>
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

                  {data?.data?.map((r: any) => (
                    <Tr key={r.student?.id}>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar name={r.student?.fullName ?? 'U'} size={28} />
                          <span style={{ fontWeight: 500 }}>
                            {r.student?.fullName}
                          </span>
                        </div>
                      </Td>

                      {(['absenceScore', 'paymentScore', 'progressionScore'] as const).map(
                        (k) => (
                          <Td key={k}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div
                                style={{
                                  width: 60,
                                  height: 4,
                                  background: '#eef2f7',
                                  borderRadius: 99,
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${r[k]}%`,
                                    height: '100%',
                                    background:
                                      r[k] >= 70
                                        ? '#ef4444'
                                        : r[k] >= 40
                                          ? '#f59e0b'
                                          : '#10b981',
                                    borderRadius: 99,
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontFamily: 'var(--mono)',
                                  color: 'var(--text-2)',
                                }}
                              >
                                {r[k]}
                              </span>
                            </div>
                          </Td>
                        )
                      )}

                      <Td>
                        <span
                          style={{
                            fontFamily: 'var(--mono)',
                            fontWeight: 700,
                            fontSize: 16,
                            color:
                              r.totalRiskScore >= 70
                                ? '#f87171'
                                : r.totalRiskScore >= 40
                                  ? '#f59e0b'
                                  : '#10b981',
                          }}
                        >
                          {r.totalRiskScore}
                        </span>
                      </Td>

                      <Td>
                        <RiskBadge level={r.riskLevel} />
                      </Td>

                      <Td>
                        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                          {r.recommendation}
                        </span>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}

      {tab === 'assistant' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
              Posez une question sur le centre, les étudiants, les paiements, les
              présences ou les informations ajoutées par l’administration.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Ex: Quels sont les documents nécessaires pour l'inscription ?"
                  value={question}
                  onChange={setQuestion}
                />
              </div>

              <Button
                disabled={!question || askAI.isPending}
                onClick={() => askAI.mutate(question)}
              >
                {askAI.isPending ? 'Analyse...' : '→ Envoyer'}
              </Button>
            </div>
          </Card>

          {answer && (
            <Card
              style={{
                padding: 20,
                background:
                  'linear-gradient(135deg,rgba(99,102,241,.08),rgba(59,130,246,.04))',
                borderColor: 'rgba(99,102,241,.25)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--accent)',
                  fontWeight: 700,
                  marginBottom: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '.5px',
                }}
              >
                ⚡ Réponse IA
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {answer}
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'knowledge' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>
              Ajouter une information
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                placeholder="Titre — Ex: Conditions d'inscription"
                value={knowledgeForm.title}
                onChange={(v) =>
                  setKnowledgeForm((f) => ({ ...f, title: v }))
                }
              />

              <Input
                placeholder="Catégorie — Ex: Inscription, Paiement, Formations"
                value={knowledgeForm.category}
                onChange={(v) =>
                  setKnowledgeForm((f) => ({ ...f, category: v }))
                }
              />

              <textarea
                placeholder="Contenu de l'information..."
                value={knowledgeForm.content}
                onChange={(e) =>
                  setKnowledgeForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={7}
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '12px 14px',
                  color: 'var(--text)',
                  fontSize: 13,
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  boxShadow: 'var(--shadow-in)',
                  resize: 'vertical',
                }}
              />

              <Input
                placeholder="Mots-clés séparés par virgule — inscription, dossier, تسجيل"
                value={knowledgeForm.keywords}
                onChange={(v) =>
                  setKnowledgeForm((f) => ({ ...f, keywords: v }))
                }
              />

              <Button
                disabled={
                  createKnowledge.isPending ||
                  !knowledgeForm.title.trim() ||
                  !knowledgeForm.content.trim()
                }
                onClick={() => createKnowledge.mutate()}
                style={{ justifyContent: 'center' }}
              >
                {createKnowledge.isPending
                  ? 'Enregistrement...'
                  : '+ Enregistrer'}
              </Button>
            </div>
          </Card>

          <Card style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>
              Informations enregistrées
            </div>

            {knowledgeLoading ? (
              <div className="skeleton" style={{ height: 160 }} />
            ) : !knowledgeData?.length ? (
              <Empty message="Aucune information enregistrée" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {knowledgeData.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 14,
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--text-2)',
                            marginTop: 2,
                          }}
                        >
                          {item.category ?? 'Sans catégorie'}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteKnowledge.mutate(item.id)}
                        disabled={deleteKnowledge.isPending}
                      >
                        Supprimer
                      </Button>
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 13,
                        color: 'var(--text-2)',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.content}
                    </div>

                    {item.keywords?.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          flexWrap: 'wrap',
                          marginTop: 10,
                        }}
                      >
                        {item.keywords.map((k: string) => (
                          <span
                            key={k}
                            style={{
                              fontSize: 10,
                              padding: '4px 8px',
                              borderRadius: 999,
                              background: 'rgba(99,102,241,.08)',
                              color: 'var(--accent)',
                              fontWeight: 700,
                            }}
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
