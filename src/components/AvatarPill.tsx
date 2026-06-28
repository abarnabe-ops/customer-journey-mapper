import { useState, useEffect, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { useLanguage } from '../contexts/LanguageContext'

interface AvatarPillProps {
  user: User
  onSignOut: () => void
}

export function AvatarPill({ user, onSignOut }: AvatarPillProps) {
  const { t, lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('touchstart', close) }
  }, [open])

  const photoUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User'
  const firstName = displayName.split(' ')[0]
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div ref={rootRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:6, background:open?'#3D4F63':'#334155', border:'1px solid #475569', borderRadius:20, padding:'3px 10px 3px 3px', cursor:'pointer', userSelect:'none', outline:'none' }}
      >
        {photoUrl
          ? <img src={photoUrl} alt={displayName} style={{ width:26, height:26, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
          : <div style={{ width:26, height:26, borderRadius:'50%', background:'#3B82F6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>{initials}</div>
        }
        <span style={{ color:'#F1F5F9', fontSize:12, fontWeight:500, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{firstName}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink:0, transform:open?'rotate(180deg)':'none', transition:'transform .15s' }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>

      {open && (
        <div style={{ position:'fixed', top:52, right:12, background:'#1E293B', border:'1px solid #334155', borderRadius:8, minWidth:210, boxShadow:'0 8px 24px rgba(0,0,0,.6)', zIndex:9999, overflow:'hidden', fontFamily:"'Inter',system-ui,sans-serif" }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid #334155' }}>
            <div style={{ color:'#94A3B8', fontSize:11, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.email}</div>
          </div>

          {/* Language toggle */}
          <button
            onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); setOpen(false) }}
            style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 12px', margin:'4px 0 0', background:'transparent', border:'none', color:'#CBD5E1', fontSize:13, cursor:'pointer', textAlign:'left' }}
            onPointerEnter={e => (e.currentTarget.style.background = '#273344')}
            onPointerLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={{ flex:1 }}>{t.language}</span>
            <span style={{ background:'#334155', borderRadius:4, padding:'2px 7px', fontSize:11, fontWeight:600, color:'#94A3B8' }}>{t.switchFlag} {t.switchLang}</span>
          </button>

          <div style={{ height:1, background:'#334155', margin:'4px 10px' }}/>

          {/* Sign out */}
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 12px', marginBottom:4, background:'transparent', border:'none', color:'#F87171', fontSize:13, cursor:'pointer', textAlign:'left' }}
            onPointerEnter={e => (e.currentTarget.style.background = '#2D1B1B')}
            onPointerLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {t.signOut}
          </button>
        </div>
      )}
    </div>
  )
}
