import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Read optional status filter from URL
        // Example: /api/connections/list?status=pending
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status'); // can be null

        // Step 1: Fetch connections where user is either investor or vendor
        // We use .or() to get both directions
        let query = supabaseAdmin
            .from('investor_vendor_connections')
            .select(`
                id,
                investor_id,
                vendor_id,
                initiated_by,
                status,
                created_at,
                accepted_at,
                investor:users!investor_vendor_connections_investor_id_fkey (
                    id,
                    full_name,
                    email
                ),
                vendor:users!investor_vendor_connections_vendor_id_fkey (
                    id,
                    full_name,
                    email
                )
            `)
            .or(`investor_id.eq.${userId},vendor_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        // Apply status filter only if provided
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data: connections, error } = await query;

        if (error) {
            console.error('List connections error:', error);
            return NextResponse.json(
                { success: false, message: 'Failed to fetch connections' },
                { status: 500 }
            );
        }

        // Step 2: Separate into categories for easier UI consumption
        // incoming = requests sent TO this user
        // outgoing = requests sent BY this user
        const incoming = connections.filter(c => {
            return (
                (c.initiated_by === 'investor' && c.vendor_id === userId) ||
                (c.initiated_by === 'vendor' && c.investor_id === userId)
            );
        });

        const outgoing = connections.filter(c => {
            return (
                (c.initiated_by === 'investor' && c.investor_id === userId) ||
                (c.initiated_by === 'vendor' && c.vendor_id === userId)
            );
        });

        const accepted = connections.filter(c => c.status === 'accepted');

        return NextResponse.json({
            success: true,
            connections,       // all connections
            incoming,          // requests received by this user
            outgoing,          // requests sent by this user
            accepted,          // active connections (can chat)
        });

    } catch (err) {
        console.error('List error:', err);
        return NextResponse.json(
            { success: false, message: 'Unexpected error' },
            { status: 500 }
        );
    }
}