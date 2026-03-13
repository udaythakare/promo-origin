import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { connection_id, content } = await request.json();

        if (!connection_id || !content?.trim()) {
            return NextResponse.json(
                { success: false, message: 'connection_id and content are required' },
                { status: 400 }
            );
        }

        // Step 1: Verify connection exists and user is a participant
        const { data: connection, error: connError } = await supabaseAdmin
            .from('investor_vendor_connections')
            .select('id, investor_id, vendor_id, status')
            .eq('id', connection_id)
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

        // Step 2: Block sending if connection not accepted
        if (connection.status !== 'accepted') {
            return NextResponse.json(
                { success: false, message: 'Cannot send message — connection not accepted yet' },
                { status: 403 }
            );
        }

        // Step 3: Insert the message
        const { data: message, error: msgError } = await supabaseAdmin
            .from('messages')
            .insert({
                connection_id,
                sender_id: userId,
                content: content.trim(),
            })
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
            .single();

        if (msgError) {
            console.error('Message insert error:', msgError);
            return NextResponse.json(
                { success: false, message: 'Failed to send message' },
                { status: 500 }
            );
        }

        // Supabase Realtime will automatically broadcast this INSERT
        // to anyone subscribed to this connection_id channel
        // No extra code needed here for that

        return NextResponse.json({
            success: true,
            message,
        });

    } catch (err) {
        console.error('Send message error:', err);
        return NextResponse.json(
            { success: false, message: 'Unexpected error' },
            { status: 500 }
        );
    }
}
