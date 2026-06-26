import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set — auth and storage will be unavailable')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

// ─── Storage KV adapter backed by Supabase ────────────────────────────────────
// Falls back to localStorage if user is not authenticated

export async function storageGet(key: string): Promise<{ value: string } | null> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    const v = localStorage.getItem(`jm_${key}`)
    return v ? { value: v } : null
  }
  const { data, error } = await supabase
    .from('storage_kv')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) {
    console.error('storageGet error', error)
    return null
  }
  return data ? { value: data.value } : null
}

export async function storageSet(key: string, value: string): Promise<void> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    localStorage.setItem(`jm_${key}`, value)
    return
  }
  const { error } = await supabase.from('storage_kv').upsert(
    { key, value },
    { onConflict: 'key' }
  )
  if (error) console.error('storageSet error', error)
}

export async function storageDelete(key: string): Promise<void> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    localStorage.removeItem(`jm_${key}`)
    return
  }
  const { error } = await supabase.from('storage_kv').delete().eq('key', key)
  if (error) console.error('storageDelete error', error)
}
