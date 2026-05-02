'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import api from '@/lib/api'

import {
  FormField,
  Input,
} from '@/components/ui'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('admin@ilima.dz')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
 
  const handleLogin = async () => {
    setLoading(true); setError('')
    console.log(email, password)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('adminName', data.data.admin.name)
      router.push('/dashboard')
    } catch { setError('Email ou mot de passe incorrect.') }
    finally { setLoading(false) }
  }
 
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:16,
      background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,.2) 0%, transparent 60%)',
    }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,var(--accent),#3b82f6)', fontSize:24, fontWeight:800, color:'#fff', boxShadow:'0 0 30px rgba(99,102,241,.4)', marginBottom:16 }}>I</div>
          <div style={{ fontSize:26, fontWeight:800, letterSpacing:'-.5px' }}>ILIMA Center</div>
          <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>Espace Administrateur</div>
        </div>
 
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:32, boxShadow:'0 24px 64px rgba(0,0,0,.4)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <FormField label="Adresse Email">
              <Input type="email" placeholder="admin@ilima.dz" value={email} onChange={setEmail} />
            </FormField>
            <FormField label="Mot de passe">
              <Input type="password" placeholder="••••••••" value={password} onChange={setPass} />
            </FormField>
            {error && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:'var(--r-sm)', padding:'10px 14px', fontSize:12, color:'#f87171' }}>{error}</div>}
            <button
              onClick={handleLogin} disabled={loading}
              onKeyDown={e => e.key==='Enter' && handleLogin()}
              style={{ background:'linear-gradient(135deg,var(--accent),#4f46e5)', color:'#fff', border:'none', borderRadius:'var(--r-sm)', padding:'12px', fontFamily:'var(--font)', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?.6:1, boxShadow:'0 0 24px var(--accent-glow)', transition:'all .2s', marginTop:4 }}
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </div>
        </div>
        <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:'var(--text-muted)' }}>
          ILIMA Formation & Consulting © 2025
        </div>
      </div>
    </div>
  )
}