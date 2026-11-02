import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && key);
// A placeholder client allows the visual demo to load before credentials are supplied.
// Public listing queries are skipped until configured; admin operations still require a real backend.
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'demo-public-placeholder');
