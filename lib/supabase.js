// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Use NEXT_PUBLIC_ for public client-side env vars

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };