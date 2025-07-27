import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials. Add SUPABASE_URL and SUPABASE_ANON_KEY to .env file');
  console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`);
  console.log(`   SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Found' : '❌ Missing'}`);
  process.exit(1);
}

console.log('✅ Supabase credentials loaded successfully');
export const supabase = createClient(supabaseUrl, supabaseKey);