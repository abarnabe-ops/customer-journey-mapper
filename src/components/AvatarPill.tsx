import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { User } from '@supabase/supabase-js'

interface AvatarPillProps {
  user: User
  onSignOut: () => void
}

export function AvatarPill({ user, onSignOut }: AvatarPillProps) {
  const photoUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    'User'
  const firstName = displayName.split(' ')[0]
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu.Root>
      {/* ── Trigger pill ───────────────────────────────── */}
      <DropdownMenu.Trigger asChild>
        <button
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
            flexShrink: 0,
            outline: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3D4F63')}
          onMouseLeave={e => (e.currentTarget.style.background = '#334155')}
        >
          {/* Avatar image or initials */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
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

          <span style={{
            color: '#F1F5F9', fontSize: 12, fontWeight: 500,
            maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {firstName}
          </span>

          {/* Chevron */}
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      {/* ── Portal dropdown — renders at <body>, never inside topbar ── */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          style={{
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 8,
            minWidth: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,.6)',
            zIndex: 9999,
            overflow: 'hidden',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {/* Email label */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #334155' }}>
            <div style={{ color: '#94A3B8', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', margin: 4, borderRadius: 6,
              color: '#F87171', fontSize: 12, cursor: 'pointer',
              outline: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2D1B1B')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Déconnexion
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
