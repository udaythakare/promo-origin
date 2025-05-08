import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateUniqueUsername } from '@/helpers/registrationHelpers';

export async function POST(request) {
    try {
        const { fullname, email, password, mobile_number } = await request.json();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate unique username
        const username = await generateUniqueUsername(fullname);

        // Insert user
        const { data: user, error: userErr } = await supabaseAdmin
            .from('users')
            .insert({ full_name: fullname, email, password: hashedPassword, mobile_number, username })
            .select('id')
            .single();
        if (userErr) throw userErr;

        // Assign default role
        const { error: roleErr } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: user.id, role: 'app_user', is_verified: false });
        if (roleErr) throw roleErr;

        // Create a token string using time and randomness
        const rawToken = `${email}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        const hashedToken = await bcrypt.hash(rawToken, 10);

        // Store hashed token
        const { error: tokenErr } = await supabaseAdmin
            .from('user_tokens')
            .insert({ user_id: user.id, token: hashedToken, created_at: new Date() });
        if (tokenErr) throw tokenErr;

        return NextResponse.json({ success: true, token: rawToken }); // optionally return raw token if needed for the link
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
}
