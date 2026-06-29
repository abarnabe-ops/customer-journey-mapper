import { useLanguage } from '../contexts/LanguageContext'
import { CHANGELOG, type ChangeType } from '../changelog'

const TYPE_META: Record<ChangeType, { label: { fr: string; en: string }; color: string; bg: string }> = {
  feat:     { label: { fr: 'Nouveauté',    en: 'New'         }, color: '#1D4ED8', bg: '#DBEAFE' },
  fix:      { label: { fr: 'Correction',   en: 'Fix'         }, color: '#B45309', bg: '#FEF3C7' },
  perf:     { label: { fr: 'Performance',  en: 'Performance' }, color: '#065F46', bg: '#D1FAE5' },
  style:    { label: { fr: 'Interface',    en: 'UI / Style'  }, color: '#6D28D9', bg: '#EDE9FE' },
  refactor: { label: { fr: 'Refactor',     en: 'Refactor'    }, color: '#475569', bg: '#F1F5F9' },
  remove:   { label: { fr: 'Supprimé',     en: 'Removed'     }, color: '#9F1239', bg: '#FFE4E6' },
}

interface Props {
  onClose: () => void
}

export function ChangelogModal({ onClose }: Props) {
  const { t, lang } = useLanguage()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      fontFamily: "'Inter',system-ui,sans-serif",
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#FFFFFF', borderRadius: 16,
        width: '100%', maxWidth: 560, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,.25)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
              {lang === 'fr' ? 'Mises à jour du produit' : 'Product updates'}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              Customer Journey Mapper
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'none', border: '1px solid #E5E7EB',
            cursor: 'pointer', color: '#6B7280',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Scrollable entries */}
        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
          {CHANGELOG.map((entry, ei) => (
            <div key={entry.version} style={{
              padding: '20px 24px',
              borderBottom: ei < CHANGELOG.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              {/* Version + date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                  background: '#2563EB', color: '#fff',
                  borderRadius: 6, padding: '2px 8px',
                  fontSize: 12, fontWeight: 700,
                }}>v{entry.version}</span>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                  {new Date(entry.date).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                {ei === 0 && (
                  <span style={{
                    background: '#D1FAE5', color: '#065F46',
                    borderRadius: 20, padding: '1px 8px',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {lang === 'fr' ? 'Dernière version' : 'Latest'}
                  </span>
                )}
              </div>

              {/* Changes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {entry.changes.map((change, ci) => {
                  const meta = TYPE_META[change.type]
                  return (
                    <div key={ci} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{
                        background: meta.bg, color: meta.color,
                        borderRadius: 4, padding: '1px 6px',
                        fontSize: 10, fontWeight: 700,
                        flexShrink: 0, marginTop: 1,
                        textTransform: 'uppercase', letterSpacing: '.3px',
                      }}>
                        {meta.label[lang]}
                      </span>
                      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                        {lang === 'fr' ? change.fr : change.en}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px', borderTop: '1px solid #F1F5F9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0, background: '#FAFAFA',
        }}>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            {lang === 'fr' ? `${CHANGELOG.length} versions` : `${CHANGELOG.length} releases`}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            {lang === 'fr' ? 'Développé par Leadfox' : 'Built by Leadfox'}
          </span>
        </div>
      </div>
    </div>
  )
}
