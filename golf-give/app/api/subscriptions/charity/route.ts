import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * PATCH /api/subscriptions/charity
 * Updates the user's charity selection and contribution percentage.
 * Uses service-role client to bypass the RLS policy that only allows SELECT on subscriptions.
 */
export async function PATCH(req: NextRequest) {
  try {
    // 1. Verify session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body
    const { charityId, charityPercentage } = await req.json()

    if (
      typeof charityPercentage !== 'number' ||
      charityPercentage < 10 ||
      charityPercentage > 100
    ) {
      return NextResponse.json({ error: 'Invalid charity percentage (must be 10–100)' }, { status: 400 })
    }

    // 3. Update using admin client — bypasses the SELECT-only RLS for users
    const adminSupabase = await createAdminClient()
    const { error: updateError } = await adminSupabase
      .from('subscriptions')
      .update({
        selected_charity_id: charityId || null,
        charity_percentage: charityPercentage,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (updateError) {
      console.error('[charity update] DB error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[charity update] unhandled error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
