import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const isConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return url.startsWith('http')
}

// Lightweight mock that returns empty/safe values for all common Supabase calls
function createMockClient() {
  const empty = { data: null, error: null, count: null }
  const emptyArray = { data: [], error: null, count: 0 }
  const mockQuery: any = {
    select: () => mockQuery,
    insert: () => Promise.resolve(empty),
    update: () => Promise.resolve(empty),
    delete: () => Promise.resolve(empty),
    eq: () => mockQuery,
    in: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: () => Promise.resolve(empty),
    maybeSingle: () => Promise.resolve(empty),
    then: (cb: any) => Promise.resolve(emptyArray).then(cb),
  }
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    from: () => mockQuery,
    storage: { from: () => ({ upload: () => Promise.resolve(empty), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  } as any
}

export async function createClient() {
  if (!isConfigured()) return createMockClient()
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

// Plain service-role client — fully bypasses RLS, no cookie/session interference
export async function createAdminClient() {
  if (!isConfigured()) return createMockClient()
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
