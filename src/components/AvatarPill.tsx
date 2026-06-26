import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface AvatarPillProps {
  user: User
  onSignOut: () => void
}

export function AvatarPill({ user, onSignOut }: AvatarPillProps) {
  const [open, setOpen] = useState(false)

  const photoUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={{ position: 'relative' }}>
      {/* Pill button */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#334155',
          border: '1px solid #475569',
          borderRadius: 20,
          padding: '3px 10px 3px 3px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Avatar */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={displayName}
            style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: '#3B82F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
        )}

        <span style={{ color: '#F1F5F9', fontSize: 12, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName.split(' ')[0]}
        </span>

        {/* Chevron */}
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop to close */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 8,
            overflow: 'hidden',
            minWidth: 190,
            boxShadow: '0 8px 24px rgba(0,0,0,.6)',
            zIndex: 1000,
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #334155' }}>
              <div style={{ color: '#94A3B8', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
            <div style={{ padding: 4 }}>
              <button
                onClick={() => { setOpen(false); onSignOut() }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: 'none',
                  border: 'none',
                  borderRadius: 6,
                  color: '#F87171',
                  fontSize: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2D1B1B')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
