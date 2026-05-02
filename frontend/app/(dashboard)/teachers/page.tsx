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
export default function TeachersPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ full_name:'', phone:'', email:'', specialty:'' })
 
  const { data: teachers } = useQuery({ queryKey:['teachers'], queryFn:()=>api.get('/teachers').then(r=>r.data) })
  const createMutation = useMutation({ mutationFn:(d:any)=>api.post('/teachers',d), onSuccess:()=>{qc.invalidateQueries({queryKey:['teachers']});setShowCreate(false)} })
  const toggleMutation  = useMutation({ mutationFn:(id:number)=>api.patch(`/teachers/${id}/toggle-status`), onSuccess:()=>qc.invalidateQueries({queryKey:['teachers']}) })
 
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <PageHeader title="Enseignants" subtitle={`${teachers?.meta?.total??0} enseignant(s)`} action={<Button onClick={()=>setShowCreate(true)}>+ Ajouter Enseignant</Button>} />
      <Card>
        <Table>
          <thead><tr><Th>Nom</Th><Th>Téléphone</Th><Th>Email</Th><Th>Spécialité</Th><Th>Groupes</Th><Th>Statut</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {teachers?.data?.length===0 && <tr><td colSpan={7}><Empty /></td></tr>}
            {teachers?.data?.map((t:any)=>(
              <Tr key={t.id}>
                <Td><div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent-5))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{t.fullName?.[0]}</div><span style={{ fontWeight:500 }}>{t.fullName}</span></div></Td>
                <Td><span style={{ color:'var(--text-secondary)' }}>{t.phone}</span></Td>
                <Td><span style={{ fontSize:12, color:'var(--text-muted)' }}>{t.email??'—'}</span></Td>
                <Td><Badge variant="purple">{t.specialty??'—'}</Badge></Td>
                <Td><span style={{ fontFamily:'var(--mono)', fontSize:12 }}>{t.groupsCount??0}</span></Td>
                <Td><Badge variant={t.status?'success':'default'}>{t.status?'Actif':'Inactif'}</Badge></Td>
                <Td><Button size="sm" variant="ghost" onClick={()=>toggleMutation.mutate(t.id)}>{t.status?'Désactiver':'Activer'}</Button></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
 
      {showCreate && (
        <Modal title="Nouvel Enseignant" onClose={()=>setShowCreate(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <FormField label="Nom complet *"><Input placeholder="Amira Boudiaf" value={form.full_name} onChange={v=>setForm(f=>({...f,full_name:v}))} /></FormField>
            <FormField label="Téléphone *"><Input placeholder="0660 000 000" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} /></FormField>
            <FormField label="Email"><Input type="email" placeholder="email@ilima.dz" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} /></FormField>
            <FormField label="Spécialité"><Input placeholder="Anglais, Informatique..." value={form.specialty} onChange={v=>setForm(f=>({...f,specialty:v}))} /></FormField>
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <Button variant="ghost" onClick={()=>setShowCreate(false)} style={{ flex:1, justifyContent:'center' }}>Annuler</Button>
              <Button disabled={createMutation.isPending} onClick={()=>createMutation.mutate(form)} style={{ flex:1, justifyContent:'center' }}>
                {createMutation.isPending?'Création...':'Ajouter'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}