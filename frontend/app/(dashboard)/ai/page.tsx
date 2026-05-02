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
export default function AiPage() {
  const qc = useQueryClient()
  const [level, setLevel] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [tab, setTab] = useState<'risk'|'assistant'>('risk')
 
  const { data, isLoading } = useQuery({ queryKey:['risk',level], queryFn:()=>api.get('/ai/risk-analyses',{params:{level}}).then(r=>r.data) })
  const analyzeAll = useMutation({ mutationFn:()=>api.post('/ai/analyze-all'), onSuccess:()=>qc.invalidateQueries({queryKey:['risk']}) })
  const askAI = useMutation({ mutationFn:(q:string)=>api.post('/ai/assistant',{question:q}).then(r=>r.data.data), onSuccess:(d:any)=>setAnswer(d.answer) })
 
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <PageHeader title="IA Insights" subtitle="Analyse intelligente et assistant administratif" />
 
      {/* Tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)' }}>
        {[{k:'risk',l:'Risque d\'abandon'},{k:'assistant',l:'Assistant IA'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)} style={{ fontSize:13, padding:'10px 20px', fontFamily:'var(--font)', fontWeight:600, cursor:'pointer', background:'none', border:'none', borderBottom: tab===t.k ? '2px solid var(--accent)' : '2px solid transparent', color: tab===t.k ? 'var(--accent-light)' : 'var(--text-muted)', transition:'all .2s' }}>{t.l}</button>
        ))}
      </div>
 
      {tab === 'risk' && (
        <>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            {[{v:'',l:'Tous'},{v:'high',l:'Risque Élevé'},{v:'medium',l:'Moyen'},{v:'low',l:'Faible'}].map(f=>(
              <button key={f.v} onClick={()=>setLevel(f.v)} style={{ fontSize:12, padding:'6px 14px', borderRadius:99, fontFamily:'var(--font)', fontWeight:600, cursor:'pointer', background: level===f.v?'linear-gradient(135deg,var(--accent),#4f46e5)':'var(--bg-elevated)', color: level===f.v?'#fff':'var(--text-secondary)', border: level===f.v?'none':'1px solid var(--border)', transition:'all .2s' }}>{f.l}</button>
            ))}
            <Button variant="outline" onClick={()=>analyzeAll.mutate()} disabled={analyzeAll.isPending} style={{ marginLeft:'auto' }}>
              {analyzeAll.isPending ? 'Analyse...' : '↻ Analyser Tous'}
            </Button>
          </div>
 
          <Card style={{ padding:16 }}>
  <div style={{ fontSize:13, color:'var(--text-secondary)' }}>
    Cette analyse identifie les étudiants nécessitant un suivi selon
    leur assiduité, leurs paiements et leur progression.
  </div>
</Card>
 
          <Card>
            {isLoading ? <div style={{ padding:24 }}><div className="skeleton" style={{ height:200 }} /></div> : (
              <Table>
                <thead><tr><Th>Étudiant</Th><Th>Absences</Th><Th>Paiements</Th><Th>Progression</Th><Th>Score Total</Th><Th>Niveau</Th><Th>Recommandation</Th></tr></thead>
                <tbody>
                  {data?.data?.length === 0 && <tr><td colSpan={7}><Empty /></td></tr>}
                  {data?.data?.map((r: any) => (
                    <Tr key={r.student?.id}>
                      <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={r.student?.fullName??'U'} size={28} /><span style={{ fontWeight:500 }}>{r.student?.fullName}</span></div></Td>
                      {(['absenceScore','paymentScore','progressionScore'] as const).map(k=>(
                        <Td key={k}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:60, height:4, background:'var(--bg-elevated)', borderRadius:99, overflow:'hidden' }}>
                              <div style={{ width:`${r[k]}%`, height:'100%', background: r[k]>=70?'#ef4444':r[k]>=40?'#f59e0b':'#10b981', borderRadius:99 }}/>
                            </div>
                            <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text-secondary)' }}>{r[k]}</span>
                          </div>
                        </Td>
                      ))}
                      <Td><span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:16, color: r.totalRiskScore>=70?'#f87171':r.totalRiskScore>=40?'#fbbf24':'#34d399' }}>{r.totalRiskScore}</span></Td>
                      <Td><RiskBadge level={r.riskLevel} /></Td>
                      <Td><span style={{ fontSize:12, color:'var(--text-muted)' }}>{r.recommendation}</span></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
 
      {tab === 'assistant' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16 }}>
              Posez une question sur le centre, les étudiants, les paiements ou les présences.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <Input placeholder="Ex: Combien d'étudiants ont des paiements en retard ?" value={question} onChange={setQuestion} />
              </div>
              <Button disabled={!question || askAI.isPending} onClick={() => askAI.mutate(question)}>
                {askAI.isPending ? 'Analyse...' : '→ Envoyer'}
              </Button>
            </div>
          </Card>
 
          {answer && (
            <Card style={{ padding:20, background:'linear-gradient(135deg,rgba(99,102,241,.08),rgba(59,130,246,.04))', borderColor:'rgba(99,102,241,.25)' }}>
              <div style={{ fontSize:11, color:'var(--accent-light)', fontWeight:700, marginBottom:10, textTransform:'uppercase', letterSpacing:'.5px' }}>⚡ Réponse IA</div>
              <div style={{ fontSize:14, color:'var(--text-primary)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{answer}</div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
