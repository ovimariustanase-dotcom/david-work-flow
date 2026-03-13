import { createClient } from '@supabase/supabase-js'

// Acestea ar trebui în mod normal să fie în .env, dar pentru demo le punem aici
// Utilizatorul va trebui să le înlocuiască cu propriile credențiale Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
