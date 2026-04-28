import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin' ? adminSupabase : null
}

// POST — create charity
export async function POST(req: NextRequest) {
  const adminSupabase = await verifyAdmin()
  if (!adminSupabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { error, data } = await adminSupabase.from('charities').insert({ ...body, events: body.events ?? [] }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

// PATCH — update charity
export async function PATCH(req: NextRequest) {
  const adminSupabase = await verifyAdmin()
  if (!adminSupabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error, data } = await adminSupabase
    .from('charities')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

// DELETE — delete charity
export async function DELETE(req: NextRequest) {
  const adminSupabase = await verifyAdmin()
  if (!adminSupabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await adminSupabase.from('charities').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

// GET — list all charities (for refresh)
export async function GET() {
  const adminSupabase = await verifyAdmin()
  if (!adminSupabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await adminSupabase.from('charities').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
