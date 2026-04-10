import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseKey as string
) as SupabaseClient<Database>;

console.log('Supabase client initialised');
