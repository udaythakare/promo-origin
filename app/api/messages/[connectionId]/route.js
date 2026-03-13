import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { connectionId } = params;

        // Step 1: Verify this user is actually part of this connection
        // This is important — without this check anyone could read any chat
        const { data: connection, error: connError } = await supabaseAdmin
            .from('investor_vendor_connections')
            .select('id, investor_id, vendor_id, status')
            .eq('id', connectionId)
            .single();

        if (connError || !connection) {
            return NextResponse.json(
                { success: false, message: 'Connection not found' },
                { status: 404 }
            );
        }

        const isParticipant =
            connection.investor_id === userId ||
            connection.vendor_id === userId;

        if (!isParticipant) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        // Step 2: Only allow reading messages if connection is accepted
        if (connection.status !== 'accepted') {
            return NextResponse.json(
                { success: false, message: 'Connection is not active yet' },
                { status: 403 }
            );
        }

        // Step 3: Fetch messages with sender name
        const { data: messages, error: msgError } = await supabaseAdmin
            .from('messages')
            .select(`
                id,
                content,
                is_read,
                created_at,
                sender_id,
                sender:users!messages_sender_id_fkey (
                    id,
                    full_name
                )
            `)
            .eq('connection_id', connectionId)
            .order('created_at', { ascending: true });

        if (msgError) {
            console.error('Messages fetch error:', msgError);
            return NextResponse.json(
                { success: false, message: 'Failed to fetch messages' },
                { status: 500 }
            );
        }

        // Step 4: Mark unread messages as read
        // (messages sent by the other person, not by me)
        await supabaseAdmin
            .from('messages')
            .update({ is_read: true })
            .eq('connection_id', connectionId)
            .neq('sender_id', userId)
            .eq('is_read', false);

        return NextResponse.json({
            success: true,
            messages,
            connection,
        });

    } catch (err) {
        console.error('Get messages error:', err);
        return NextResponse.json(
            { success: false, message: 'Unexpected error' },
            { status: 500 }
        );
    }
}