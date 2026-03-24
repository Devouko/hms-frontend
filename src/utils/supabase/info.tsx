/* Reads Supabase credentials from environment variables */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);

export const projectId = urlMatch ? urlMatch[1] : '';
export const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
