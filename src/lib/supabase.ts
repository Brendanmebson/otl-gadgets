import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// The app runs fully on mock data (see src/data/mockData.ts) until these
// env vars are set, so `npm run dev` works out of the box. Once you connect
// a real Supabase project, every hook in src/hooks/ automatically switches
// to live queries — no component code needs to change.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null
