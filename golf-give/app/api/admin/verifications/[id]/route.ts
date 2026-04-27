import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status, adminNotes } = await req.json()
  const supabase = await createAdminClient()

  const { error } = await supabase.from('winner_verifications').update({
    status,
    admin_notes: adminNotes || null,
    reviewed_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If approved, update the draw result payment status to 'verified'
  if (status === 'approved') {
    const { data: v } = await supabase.from('winner_verifications').select('draw_result_id').eq('id', id).single()
    if (v) {
      await supabase.from('draw_results').update({ payment_status: 'verified' }).eq('id', v.draw_result_id)
    }
  }

  return NextResponse.json({ success: true })
}
