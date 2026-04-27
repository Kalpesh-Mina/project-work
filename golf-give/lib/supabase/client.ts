import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url.startsWith('http')) {
    // Return a mock client shell during development before env vars are set
    return null as unknown as ReturnType<typeof createBrowserClient>
  }
  return createBrowserClient(url, key)
}
