import { createClient } from '@supabase/supabase-js';

// Wklej tutaj swoje dane do bazy Supabase
const supabaseUrl = 'https://tyfedsemkygwrfrevexo.supabase.co';
const supabaseKey = 'sb_publishable_xOD3dfaQUgz94dKjTB6WNg_WHPJP7gQ';

export const supabase = createClient(supabaseUrl, supabaseKey);