import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        const { username, email, password } = await request.json();
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // Insert user
        const { data: user, error: userErr } = await supabaseAdmin
            .from('users')
            .insert({ username, email, password: hashed })
            .select('id')
            .single();
        if (userErr) throw userErr;

        // Assign default role app_user
        const { error: roleErr } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: user.id, role: 'app_user' });
        if (roleErr) throw roleErr;

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
}
