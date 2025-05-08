import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request) {
    try {
        // Get token from URL parameters
        const url = new URL(request.url);
        const rawToken = url.searchParams.get('token');

        if (!rawToken) {
            return NextResponse.json(
                { success: false, message: 'Invalid verification link' },
                { status: 400 }
            );
        }

        // Get all unexpired and unused tokens
        const { data: tokens, error: tokenError } = await supabaseAdmin
            .from('user_tokens')
            .select('id, user_id, token')
            .eq('used', false)
            .gte('expires_at', new Date().toISOString());

        if (tokenError) {
            console.error('Error fetching tokens:', tokenError);
            return NextResponse.json(
                { success: false, message: 'Verification failed' },
                { status: 500 }
            );
        }

        // Find matching token
        let foundToken = null;
        let userId = null;

        // We need to compare with bcrypt
        for (const token of tokens) {
            const isMatch = await bcrypt.compare(rawToken, token.token);
            if (isMatch) {
                foundToken = token;
                userId = token.user_id;
                break;
            }
        }

        if (!foundToken) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Mark token as used
        const { error: updateTokenError } = await supabaseAdmin
            .from('user_tokens')
            .update({ used: true })
            .eq('id', foundToken.id);

        if (updateTokenError) {
            console.error('Error updating token:', updateTokenError);
            return NextResponse.json(
                { success: false, message: 'Verification failed' },
                { status: 500 }
            );
        }

        // Update user role to verified
        const { error: updateRoleError } = await supabaseAdmin
            .from('user_roles')
            .update({ is_verified: true })
            .eq('user_id', userId);

        if (updateRoleError) {
            console.error('Error updating role:', updateRoleError);
            return NextResponse.json(
                { success: false, message: 'Verification failed' },
                { status: 500 }
            );
        }

        // Get user email for confirmation
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('email')
            .eq('id', userId)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
            return NextResponse.json(
                { success: true, message: 'Account verified successfully' }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Account verified successfully',
            email: userData.email
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to verify account' },
            { status: 500 }
        );
    }
}