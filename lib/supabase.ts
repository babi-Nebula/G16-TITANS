/**
 * Placeholder for production Supabase integration.
 * Hackathon demo uses mocked APIs and in-memory state to keep setup fast.
 */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://demo-project.supabase.co",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "demo-anon-key",
};

export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
