import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface UseAuthReturn {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

// E2E test bypass — ONLY active when the page is opened by an automated browser
// (navigator.webdriver === true, which real users never have) AND the ?e2e=1
// query flag is present. This lets Playwright tests reach the canvas without a
// real Google OAuth flow. It is unreachable in normal use: a real visitor has
// webdriver === false, so this returns false and the real auth path runs.
function isE2E(): boolean {
  try {
    return typeof navigator !== 'undefined'
      && (navigator as any).webdriver === true
      && new URLSearchParams(window.location.search).get('e2e') === '1'
  } catch { return false }
}

const E2E_USER = { id: 'e2e-test-user', email: 'e2e@test.local', user_metadata: { full_name: 'E2E Test' } } as unknown as User

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test-mode short-circuit: skip Supabase entirely, sign in a fake user.
    if (isE2E()) {
      setUser(E2E_USER)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    // Redirect back to wherever the app is actually served (production or
    // staging), using Vite's BASE_URL so it works in both environments instead
    // of a hardcoded production path.
    const redirectTo = window.location.origin + import.meta.env.BASE_URL
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    })
    if (error) console.error('Sign in error:', error)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // Clear any residual Supabase localStorage keys
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-'))
      .forEach(k => localStorage.removeItem(k))
    window.location.href = window.location.origin + window.location.pathname
  }

  return { user, loading, signInWithGoogle, signOut }
}
