import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: drawId } = await params
  const adminSupabase = await createAdminClient()

  // Fetch the draw first to confirm it exists and check status
  const { data: draw, error: fetchError } = await adminSupabase
    .from('draws')
    .select('id, status, month, year')
    .eq('id', drawId)
    .single()

  if (fetchError || !draw) {
    return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
  }

  // Cascade delete in the correct order (FK constraints)
  // 1. draw_results
  await adminSupabase.from('draw_results').delete().eq('draw_id', drawId)

  // 2. draw_entries
  await adminSupabase.from('draw_entries').delete().eq('draw_id', drawId)

  // 3. prize_pools
  await adminSupabase.from('prize_pools').delete().eq('draw_id', drawId)

  // 4. the draw itself
  const { error: deleteError } = await adminSupabase
    .from('draws')
    .delete()
    .eq('id', drawId)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `Draw for ${draw.month}/${draw.year} deleted successfully`,
  })
}
