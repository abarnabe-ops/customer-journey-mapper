import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type Translations } from '../i18n'

interface LangCtx {
  lang:    Lang
  setLang: (l: Lang) => void
  t:       Translations
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('cjm_lang') as Lang) || 'fr'
  )

  const setLang = (l: Lang) => {
    localStorage.setItem('cjm_lang', l)
    setLangState(l)
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

/** Use in any component: const { t, lang, setLang } = useLanguage() */
export function useLanguage(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLanguage must be used within <LanguageProvider>')
  return ctx
}
