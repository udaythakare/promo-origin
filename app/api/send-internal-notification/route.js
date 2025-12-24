// app/api/notifications/route.ts
import { getUser, getUserId } from '@/helpers/userHelper'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for server-side operations
)

// GET - Fetch user notifications
export async function GET(request) {
  try {
    // const { searchParams } = new URL(request.url)
    // const userId = searchParams.get('userId')
    // const limit = parseInt(searchParams.get('limit') || '20')
    // const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    let query = supabase
      .from('internal_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notifications: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new notification
export async function POST(request) {
  try {
    const body = await request.json()
    const { message, title, type = 'info' } = body

    // const user_id = await getUserId();\
    const user_id = "fee7f9db-a31c-41ff-8f9f-82df2abbad79"

    if (!message || !user_id) {
      return NextResponse.json({ error: 'Message and user_id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('internal_notifications')
      .insert([{ message, user_id, title, type }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notification: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Mark notification as read
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { notificationId, markAllAsRead } = body
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (markAllAsRead) {
      const { error } = await supabase
        .from('internal_notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('internal_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}