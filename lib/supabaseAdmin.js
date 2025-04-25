// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client (service role key required)
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);